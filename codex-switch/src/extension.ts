import * as vscode from 'vscode';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { execFile } from 'child_process';
import { spawn } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const OPENAI_EXTENSION_ID = 'openai.chatgpt';
const PROFILE_VERSION = 2;
const LOGIN_WAIT_MS = 5 * 60 * 1000;
const LOGIN_POLL_MS = 1500;
const APP_SERVER_WAIT_MS = 12000;

type AnyObject = any;
type Profile = any;
type StoredProfile = any;
type ViewState = any;
type ViewMessage = any;

class AccountsViewProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'codexSwitch.accountsView';

  private view?: vscode.WebviewView;
  private state: ViewState = { profiles: [], currentProfileId: undefined, currentLabel: '未识别' };
  private onMessage: ((message: ViewMessage) => void) | undefined;

  resolveWebviewView(view: vscode.WebviewView): void {
    this.view = view;
    view.webview.options = { enableScripts: true };
    view.webview.onDidReceiveMessage((message) => {
      this.onMessage?.(message);
    });
    this.render(this.state);
  }

  setMessageHandler(handler: (message: ViewMessage) => void): void {
    this.onMessage = handler;
  }

  async focus(): Promise<void> {
    await vscode.commands.executeCommand('workbench.view.extension.codexSwitch');
    await vscode.commands.executeCommand(`${AccountsViewProvider.viewType}.focus`);
  }

  render(state: ViewState): void {
    this.state = state;
    if (this.view) {
      this.view.webview.html = this.getHtml(this.view.webview, state);
    }
  }

  async setPendingAction(command = '', id = ''): Promise<void> {
    await this.view?.webview.postMessage({ type: 'setPendingAction', command, id });
  }

  private getHtml(webview: vscode.Webview, state: ViewState): string {
    const nonce = String(Date.now());
    const payload = JSON.stringify(state).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>codex账号助手</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: var(--vscode-sideBar-background);
      --panel: var(--vscode-editor-background);
      --border: var(--vscode-panel-border);
      --muted: var(--vscode-descriptionForeground);
      --text: var(--vscode-foreground);
      --accent: var(--vscode-button-background);
      --accent-text: var(--vscode-button-foreground);
      --secondary-bg: var(--vscode-button-secondaryBackground);
      --secondary-text: var(--vscode-button-secondaryForeground);
      --radius: 6px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 12px;
      background: var(--bg);
      color: var(--text);
      font: 12px/1.5 var(--vscode-font-family);
    }

    .shell, .list {
      display: grid;
      gap: 12px;
    }

    .toolbar, .summary, .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    button {
      appearance: none;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 6px 12px;
      cursor: pointer;
      font: inherit;
      background: var(--secondary-bg);
      color: var(--secondary-text);
    }

    .primary {
      background: var(--accent);
      color: var(--accent-text);
      border-color: transparent;
    }

    .account {
      position: relative;
      padding: 14px 12px 12px;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--panel);
    }

    .current {
      border-color: var(--accent);
    }

    .account-header {
      display: block;
    }

    .title {
      font-size: 14px;
      font-weight: 600;
    }

    .subtle, .summary, .badge {
      color: var(--muted);
    }

    .account-header > div:first-child {
      display: grid;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }

    .summary {
      justify-content: space-between;
    }

    .metrics {
      display: grid;
      gap: 10px;
      margin-top: 10px;
    }

    .meter {
      display: grid;
      gap: 6px;
    }

    .meter-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
      column-gap: 12px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.2;
    }

    .meter-label {
      font-weight: 500;
    }

    .meter-value {
      display: inline-block;
      min-width: 44px;
      text-align: right;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .meter-track {
      height: 10px;
      width: 100%;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--foreground) 12%, transparent);
    }

    .meter-fill {
      height: 100%;
      border-radius: inherit;
      background: #2fbf5b;
    }

    .actions {
      margin-top: 12px;
    }

    .meter-reset {
      color: var(--muted);
      font-size: 11px;
      line-height: 1.3;
    }

    .badge {
      position: absolute;
      top: 14px;
      right: 12px;
    }

    .empty {
      padding: 12px 0;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <div class="shell">
    <div class="toolbar">
      <button class="primary" data-command="addAccount">添加账号</button>
      <button data-command="refreshQuota">刷新额度</button>
    </div>

    <div class="summary">
      <span>当前: <strong>${escapeHtml(state.currentLabel || '未识别')}</strong></span>
      <span>已保存: <strong>${Array.isArray(state.profiles) ? state.profiles.length : 0}</strong></span>
    </div>

    <div class="list" id="profiles"></div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const state = ${payload};
    const container = document.getElementById('profiles');
    let pendingCommand = '';
    let pendingId = '';

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderProfiles() {
      if (!Array.isArray(state.profiles) || !state.profiles.length) {
        container.innerHTML = '<div class="empty">还没有保存过账号。</div>';
        return;
      }

      container.innerHTML = state.profiles.map((profile) => {
        const current = profile.id === state.currentProfileId;
        const email = profile.email || profile.accountId || profile.id || 'Unknown';

        return \`
          <article class="account \${current ? 'current' : ''}">
            <div class="account-header">
              <div>
                <div class="title">\${escapeHtml(profile.label || 'Unknown Account')}</div>
                <div class="subtle">\${escapeHtml(email)}</div>
                <div class="subtle">\${escapeHtml(profile.planLabel || '')}</div>
                \${renderMeters(profile.quotaBars)}
              </div>
              \${current ? '<div class="badge">当前</div>' : ''}
            </div>
            <div class="actions">
              \${current ? '' : '<button class="primary" data-command="switch" data-id="' + escapeHtml(profile.id) + '">切换</button>'}
              <button data-command="remove" data-id="\${escapeHtml(profile.id)}">删除</button>
            </div>
          </article>
        \`;
      }).join('');
    }

    function renderMeters(quotaBars) {
      if (!Array.isArray(quotaBars) || !quotaBars.length) {
        return '';
      }

      return \`
        <div class="metrics">
          \${quotaBars.map((item) => \`
            <div class="meter">
              <div class="meter-head">
                <span class="meter-label">\${escapeHtml(item.label || '')}</span>
                <span class="meter-value">\${escapeHtml(String(item.remaining ?? 0))}%</span>
              </div>
              <div class="meter-track">
                <div class="meter-fill" style="width:\${Math.max(0, Math.min(100, Number(item.remaining) || 0))}%"></div>
              </div>
              \${item.resetAtLabel ? '<div class="meter-reset">重置时间: ' + escapeHtml(item.resetAtLabel) + '</div>' : ''}
            </div>
          \`).join('')}
        </div>
      \`;
    }

    function syncPendingState() {
      document.querySelectorAll('button[data-command]').forEach((element) => {
        if (!(element instanceof HTMLButtonElement)) {
          return;
        }
        const matchesCommand = pendingCommand && element.dataset.command === pendingCommand;
        const matchesTarget = !pendingId || element.dataset.id === pendingId;
        const matches = Boolean(matchesCommand && matchesTarget);
        element.disabled = Boolean(pendingCommand);
        if (matches && element.dataset.command === 'refreshQuota') {
          element.textContent = '刷新中...';
        } else if (matches && element.dataset.command === 'switch') {
          element.textContent = '切换中...';
        } else if (matches && element.dataset.command === 'remove') {
          element.textContent = '删除中...';
        } else if (element.dataset.command === 'refreshQuota') {
          element.textContent = '刷新额度';
        } else if (element.dataset.command === 'switch') {
          element.textContent = '切换';
        } else if (element.dataset.command === 'remove') {
          element.textContent = '删除';
        }
      });
    }

    document.body.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const command = target.dataset.command;
      if (command) {
        const id = target.dataset.id || '';

        if (command === 'refreshQuota') {
          pendingCommand = command;
          pendingId = id;
          syncPendingState();
        }
        vscode.postMessage({ command, id });
      }
    });

    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message?.type !== 'setPendingAction') {
        return;
      }
      pendingCommand = typeof message.command === 'string' ? message.command : '';
      pendingId = typeof message.id === 'string' ? message.id : '';
      syncPendingState();
    });

    renderProfiles();
    syncPendingState();
  </script>
</body>
</html>`;
  }
}

class CodexAccountManager {
  private readonly statusBar: vscode.StatusBarItem;
  private readonly viewProvider = new AccountsViewProvider();
  private readonly codexTerminal = vscode.window.createTerminal('Codex 登录');
  private profiles: StoredProfile[] = [];
  private currentProfile: StoredProfile | undefined;
  private loginWatcherSerial = 0;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.statusBar.command = 'codexSwitch.focusAccountsView';
    context.subscriptions.push(this.statusBar, this.codexTerminal);
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(AccountsViewProvider.viewType, this.viewProvider),
    );
  }

  async activate(): Promise<void> {
    this.registerCommands();
    this.viewProvider.setMessageHandler((message) => {
      void this.handleViewMessage(message);
    });
    await this.ensureStorageDirectory();
    await this.pruneInvalidProfiles();
    await this.reloadState();
    void this.refreshAllProfileSnapshots();
  }

  dispose(): void {}

  private registerCommands(): void {
    const commands: Array<[string, () => Promise<void>]> = [
      ['codexSwitch.addAccount', () => this.addAccount()],
      ['codexSwitch.switchAccount', () => this.switchByPicker()],
      ['codexSwitch.removeAccount', () => this.removeByPicker()],
      ['codexSwitch.focusAccountsView', () => this.viewProvider.focus()],
    ];

    for (const [command, handler] of commands) {
      this.context.subscriptions.push(vscode.commands.registerCommand(command, handler));
    }
  }

  private async handleViewMessage(message: ViewMessage): Promise<void> {
    if (message?.command === 'addAccount') {
      await this.addAccount();
      return;
    }

    if (message?.command === 'switch' && message.id) {
      const accepted = await this.confirmProfileAction(String(message.id), '切换');
      if (!accepted) {
        this.renderUi();
        return;
      }
      await this.viewProvider.setPendingAction('switch', String(message.id));
      try {
        await this.switchToProfile(String(message.id));
      } finally {
        await this.viewProvider.setPendingAction();
        this.renderUi();
      }
      return;
    }

    if (message?.command === 'remove' && message.id) {
      const accepted = await this.confirmProfileAction(String(message.id), '删除');
      if (!accepted) {
        this.renderUi();
        return;
      }
      await this.viewProvider.setPendingAction('remove', String(message.id));
      try {
        await this.removeProfile(String(message.id));
      } finally {
        await this.viewProvider.setPendingAction();
        this.renderUi();
      }
      return;
    }

    if (message?.command === 'refreshQuota') {
      await this.refreshQuotaSnapshots();
    }
  }

  private async reloadState(activeProfile?: StoredProfile): Promise<void> {
    this.profiles = await this.readProfilesFromDisk();
    this.currentProfile = activeProfile ?? (await this.readCurrentProfile());
    this.renderUi();
  }

  private renderUi(): void {
    const currentProfileId = this.resolveCurrentProfileId();
    const currentLabel = this.describeCurrentLabel();

    this.statusBar.text = `Codex: ${currentLabel}`;
    this.statusBar.tooltip = currentProfileId
      ? `当前配置: ${currentLabel}\n点击打开账号管理面板`
      : '点击打开账号管理面板';
    this.statusBar.show();

    this.viewProvider.render({
      currentProfileId,
      currentLabel,
      profiles: this.profiles.map((entry) => ({
        ...entry.profile,
        planLabel: formatPlanLabel(entry.profile),
        quotaBars: getQuotaBars(entry.profile?.rateLimits),
      })),
    });
  }

  private async addAccount(): Promise<void> {
    const codexCommand = await this.resolveCodexCommand();
    if (!codexCommand) {
      return;
    }

    await this.backupCurrentProfileIfNeeded();

    const before = await this.tryReadText(this.getAuthFilePath());
    const shellCommand = `${quoteForShell(codexCommand)} login`;

    this.codexTerminal.show(true);
    this.codexTerminal.sendText(shellCommand, true);
    void this.waitForLoginResult(before);

  }

  private async waitForLoginResult(previousText?: string): Promise<void> {
    const serial = ++this.loginWatcherSerial;
    const filePath = this.getAuthFilePath();
    const deadline = Date.now() + LOGIN_WAIT_MS;

    while (serial === this.loginWatcherSerial && Date.now() < deadline) {
      await delay(LOGIN_POLL_MS);
      const currentText = await this.tryReadText(filePath);
      if (!currentText || currentText === previousText) {
        continue;
      }

      const saved = await this.saveCurrentAuthAsProfile(false);
      if (saved) {
        await this.refreshAllProfileSnapshots();
        return;
      }
    }

    if (serial === this.loginWatcherSerial) {
      await this.reloadState();
    }
  }

  private async switchByPicker(): Promise<void> {
    if (!this.profiles.length) {
      return;
    }

    const currentId = this.currentProfile?.profile?.id;
    const picked = await vscode.window.showQuickPick(
      this.profiles.map((entry) => ({
        label: entry.profile.label,
        detail: `${entry.profile.email ?? entry.profile.accountId ?? entry.profile.id}${entry.profile.id === currentId ? ' · 当前' : ''}`,
        id: entry.profile.id,
      })),
      { placeHolder: '选择要切换到的账号' },
    );

    if (picked?.id) {
      const accepted = await this.confirmProfileAction(picked.id, '切换');
      if (!accepted) {
        return;
      }
      await this.switchToProfile(picked.id);
    }
  }

  private async removeByPicker(): Promise<void> {
    if (!this.profiles.length) {
      return;
    }

    const picked = await vscode.window.showQuickPick(
      this.profiles.map((entry) => ({
        label: entry.profile.label,
        detail: entry.profile.email ?? entry.profile.accountId ?? entry.profile.id,
        id: entry.profile.id,
      })),
      { placeHolder: '选择要删除的账号' },
    );

    if (picked?.id) {
      const accepted = await this.confirmProfileAction(picked.id, '删除');
      if (!accepted) {
        return;
      }
      await this.removeProfile(picked.id);
    }
  }

  private async confirmProfileAction(id: string, action: '切换' | '删除'): Promise<boolean> {
    const target = this.findProfileById(id);
    if (!target) {
      return false;
    }

    const accepted = await vscode.window.showWarningMessage(
      action === '切换' ? `确认切换到 ${target.profile.label} 吗？` : `确认删除 ${target.profile.label} 吗？`,
      { modal: true },
      action,
    );
    return accepted === action;
  }

  private async switchToProfile(id: string): Promise<void> {
    const target = this.findProfileById(id);
    if (!target) {
      return;
    }

    await this.writeJson(this.getAuthFilePath(), target.auth);
    this.currentProfile = target;
    await this.refreshAllProfileSnapshots();
    this.renderUi();

    const strategy = this.getConfig('openaiExtensionRefreshStrategy', 'restartExtensionHost');
    await this.refreshOpenAiExtensionState(strategy);
  }

  private async refreshQuotaSnapshots(): Promise<void> {
    await this.refreshAllProfileSnapshots(true);
  }

  private async removeProfile(id: string): Promise<void> {
    const target = this.findProfileById(id);
    if (!target) {
      return;
    }

    await fsp.unlink(path.join(await this.ensureStorageDirectory(), target.profile.fileName)).catch(() => undefined);
    this.profiles = this.profiles.filter((entry) => entry.profile.id !== id);
    this.renderUi();
  }

  private async backupCurrentProfileIfNeeded(): Promise<void> {
    const current = await this.readCurrentProfile();
    if (!current) {
      return;
    }

    if (!this.findProfileById(current.profile.id)) {
      await this.saveProfile(current, false);
    }
  }

  private async saveCurrentAuthAsProfile(showMessage: boolean): Promise<StoredProfile | undefined> {
    const current = await this.readCurrentProfile();
    if (!current) {
      return undefined;
    }

    await this.saveProfile(current, showMessage);
    return current;
  }

  private async saveProfile(entry: StoredProfile, showMessage: boolean): Promise<void> {
    const targetPath = path.join(await this.ensureStorageDirectory(), entry.profile.fileName);
    const existing = await this.tryReadStoredProfile(targetPath);
    if (JSON.stringify(existing?.auth) !== JSON.stringify(entry.auth)) {
      await this.writeJson(targetPath, entry);
    }

    const index = this.profiles.findIndex((profile) => profile.profile.id === entry.profile.id);
    if (index >= 0) {
      this.profiles[index] = entry;
    } else {
      this.profiles.push(entry);
    }

    this.profiles.sort((a, b) => String(a.profile.label).localeCompare(String(b.profile.label), 'zh-Hans-CN'));
    this.currentProfile = entry;
    this.renderUi();

    void showMessage;
  }

  private async readCurrentProfile(): Promise<StoredProfile | undefined> {
    try {
      return this.createStoredProfile(await this.readJson(this.getAuthFilePath()));
    } catch {
      return undefined;
    }
  }

  private async readProfilesFromDisk(): Promise<StoredProfile[]> {
    const directory = await this.ensureStorageDirectory();
    const files = (await fsp.readdir(directory)).filter((file) => file.endsWith('.json'));
    const entries = await Promise.all(files.map((file) => this.tryReadStoredProfile(path.join(directory, file))));
    return entries
      .filter(Boolean)
      .sort((a, b) => String(a.profile.label).localeCompare(String(b.profile.label), 'zh-Hans-CN'));
  }

  private findProfileById(id: string): StoredProfile | undefined {
    return this.profiles.find((entry) => entry.profile.id === id);
  }

  private createStoredProfile(auth: AnyObject): StoredProfile {
    const tokens = this.getTokens(auth);
    const idPayload = this.decodeJwtPayload(tokens.idToken);
    const accessPayload = this.decodeJwtPayload(tokens.accessToken);
    const authClaims = this.pickObject(idPayload, 'https://api.openai.com/auth')
      || this.pickObject(accessPayload, 'https://api.openai.com/auth')
      || {};
    const email = this.pickString(idPayload, 'email')
      || this.pickNestedString(accessPayload, ['https://api.openai.com/profile', 'email']);
    const accountId = this.pickString(authClaims, 'chatgpt_account_id')
      || this.pickString(tokens.raw, 'account_id');
    const userId = this.pickString(authClaims, 'chatgpt_user_id')
      || this.pickString(authClaims, 'user_id')
      || this.pickString(idPayload, 'sub');
    const label = firstNonEmpty(
      this.pickString(idPayload, 'name'),
      email,
      accountId,
      userId,
      'Unknown Account',
    );
    const team = this.readTeam(auth, authClaims);
    const planType = this.pickString(authClaims, 'chatgpt_plan_type');
    const accountKey = firstNonEmpty(accountId, email, userId, label);
    const teamKey = firstNonEmpty(team.id, team.name, 'personal');
    const id = slugify(`${accountKey}-${teamKey}-${hashText(`${accountKey}:${teamKey}`)}`);

    return {
      version: PROFILE_VERSION,
      profile: {
        id,
        label,
        email,
        accountId,
        teamId: team.id,
        teamName: team.name,
        planType,
        savedAt: new Date().toISOString(),
        fileName: `${id}.json`,
      },
      auth,
    };
  }

  private readTeam(auth: AnyObject, authClaims: AnyObject): AnyObject {
    const organizations = this.readOrganizations(authClaims);
    const explicitId = firstNonEmpty(
      this.pickNestedString(auth, ['organization_id']),
      this.pickNestedString(auth, ['org_id']),
      this.pickString(authClaims, 'organization_id'),
      this.pickString(authClaims, 'org_id'),
      this.pickString(authClaims, 'workspace_id'),
      this.pickString(authClaims, 'team_id'),
    );
    const explicitName = firstNonEmpty(
      this.pickNestedString(auth, ['organization_name']),
      this.pickNestedString(auth, ['org_name']),
      this.pickNestedString(auth, ['workspace_name']),
      this.pickNestedString(auth, ['team_name']),
    );
    const organization = organizations.find((entry: any) => entry.id && entry.id === explicitId)
      || organizations.find((entry: any) => entry.isDefault)
      || (organizations.length === 1 ? organizations[0] : undefined);

    return {
      id: explicitId || organization?.id,
      name: explicitName || organization?.name,
    };
  }

  private readOrganizations(authClaims: AnyObject): any[] {
    const source = Array.isArray(authClaims?.organizations) ? authClaims.organizations : [];
    return source
      .filter((entry: any) => entry && typeof entry === 'object')
      .map((entry: any) => ({
        id: typeof entry.id === 'string' ? entry.id : undefined,
        name: typeof entry.title === 'string' ? entry.title : typeof entry.name === 'string' ? entry.name : undefined,
        isDefault: typeof entry.is_default === 'boolean' ? entry.is_default : undefined,
      }))
      .filter((entry: any) => entry.id || entry.name);
  }

  private getTokens(auth: AnyObject): AnyObject {
    const tokens = auth?.tokens && typeof auth.tokens === 'object' ? auth.tokens : {};
    return {
      idToken: this.pickString(tokens, 'id_token'),
      accessToken: this.pickString(tokens, 'access_token'),
      raw: tokens,
    };
  }

  private decodeJwtPayload(token?: string): AnyObject {
    if (!token) {
      return undefined;
    }

    const parts = token.split('.');
    if (parts.length < 2) {
      return undefined;
    }

    try {
      const base64 = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(parts[1].length / 4) * 4, '=');
      return JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
    } catch {
      return undefined;
    }
  }

  private pickObject(source: AnyObject, key: string): AnyObject {
    const value = source?.[key];
    return value && typeof value === 'object' && !Array.isArray(value) ? value : undefined;
  }

  private pickString(source: AnyObject, key: string): string | undefined {
    return typeof source?.[key] === 'string' ? source[key] : undefined;
  }

  private pickNestedString(source: AnyObject, keys: string[]): string | undefined {
    let current = source;
    for (const key of keys) {
      if (!current || typeof current !== 'object') {
        return undefined;
      }
      current = current[key];
    }
    return typeof current === 'string' ? current : undefined;
  }

  private async tryReadStoredProfile(filePath: string): Promise<StoredProfile | undefined> {
    try {
      const parsed = JSON.parse(await fsp.readFile(filePath, 'utf8'));
      if (
        parsed
        && typeof parsed === 'object'
        && parsed.version === PROFILE_VERSION
        && parsed.profile
        && typeof parsed.profile.id === 'string'
        && parsed.auth
      ) {
        const normalized = this.createStoredProfile(parsed.auth);
        normalized.profile.savedAt = parsed.profile.savedAt || normalized.profile.savedAt;
        normalized.profile.rateLimits = parsed.profile.rateLimits;
        normalized.profile.planType = parsed.profile.planType || normalized.profile.planType;
        if (normalized.profile.fileName !== path.basename(filePath) || JSON.stringify(parsed) !== JSON.stringify(normalized)) {
          await this.writeJson(path.join(path.dirname(filePath), normalized.profile.fileName), normalized);
          if (normalized.profile.fileName !== path.basename(filePath)) {
            await fsp.unlink(filePath).catch(() => undefined);
          }
        }
        return normalized;
      }
    } catch {
      // Ignore invalid files.
    }

    return undefined;
  }

  private async pruneInvalidProfiles(): Promise<void> {
    const directory = await this.ensureStorageDirectory();
    const files = (await fsp.readdir(directory)).filter((file) => file.endsWith('.json'));

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(directory, file);
        if (!(await this.tryReadStoredProfile(filePath))) {
          await fsp.unlink(filePath).catch(() => undefined);
        }
      }),
    );
  }

  private async readJson(filePath: string): Promise<any> {
    return JSON.parse(await fsp.readFile(filePath, 'utf8'));
  }

  private async tryReadText(filePath: string): Promise<string | undefined> {
    try {
      return await fsp.readFile(filePath, 'utf8');
    } catch {
      return undefined;
    }
  }

  private async writeJson(filePath: string, value: any): Promise<void> {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    await fsp.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  }

  private getAuthFilePath(): string {
    return expandHome(this.getConfig('authFilePath', '~/.codex/auth.json'));
  }

  private async ensureStorageDirectory(): Promise<string> {
    const directory = expandHome(this.getConfig('storageDirectory', '~/.codex/auth-profiles'));
    await fsp.mkdir(directory, { recursive: true });
    return directory;
  }

  private getConfig(key: string, fallback: any): any {
    return vscode.workspace.getConfiguration('codexSwitch').get(key, fallback);
  }

  private async refreshOpenAiExtensionState(strategy: string): Promise<boolean> {
    if (strategy === 'none' || !vscode.extensions.getExtension(OPENAI_EXTENSION_ID)) {
      return false;
    }

    try {
      if (strategy === 'reloadWindow') {
        await vscode.commands.executeCommand('workbench.action.reloadWindow');
      } else {
        await vscode.commands.executeCommand('workbench.action.restartExtensionHost');
      }
      return true;
    } catch (error) {
      console.error('Failed to refresh OpenAI extension state', error);
      return false;
    }
  }

  private async resolveCodexCommand(): Promise<string | undefined> {
    const configuredPath = expandHome(this.getConfig('codexPath', ''));
    const candidates = uniqueStrings([
      configuredPath,
      ...findExecutablesInPath(process.env.PATH || ''),
      ...getBundledCodexCandidates(),
      ...(process.platform === 'win32' ? ['codex.cmd', 'codex.exe', 'codex'] : ['codex']),
    ]);

    for (const candidate of candidates) {
      try {
        await execFileAsync(candidate, ['--version']);
        return candidate;
      } catch {
        // Try next.
      }
    }

    return undefined;
  }

  private resolveCurrentProfileId(): string | undefined {
    if (!this.currentProfile) {
      return undefined;
    }

    const exact = this.findProfileById(this.currentProfile.profile.id);
    if (exact) {
      return exact.profile.id;
    }

    const currentAccountId = this.currentProfile.profile.accountId;
    const currentTeamId = this.currentProfile.profile.teamId;
    const fallback = this.profiles.find((entry) => {
      if (entry.profile.accountId && currentAccountId && entry.profile.accountId === currentAccountId) {
        if (!entry.profile.teamId || !currentTeamId) {
          return true;
        }
        return entry.profile.teamId === currentTeamId;
      }
      return false;
    });

    return fallback?.profile.id;
  }

  private describeCurrentLabel(): string {
    if (!this.currentProfile?.profile) {
      return '未识别';
    }

    return this.currentProfile.profile.label;
  }

  private async refreshAllProfileSnapshots(forceRender = false): Promise<void> {
    if (!this.profiles.length) {
      if (forceRender) {
        this.renderUi();
      }
      return;
    }

    const codexCommand = await this.resolveCodexCommand();
    if (!codexCommand) {
      if (forceRender) {
        this.renderUi();
      }
      return;
    }

    const storageDirectory = await this.ensureStorageDirectory();
    let changed = false;
    for (const entry of this.profiles) {
      try {
        const snapshot = await readAccountSnapshotForAuth(codexCommand, entry.auth);
        if (snapshot.planType && snapshot.planType !== entry.profile.planType) {
          entry.profile.planType = snapshot.planType;
          changed = true;
        }
        if (snapshot.email && snapshot.email !== entry.profile.email) {
          entry.profile.email = snapshot.email;
          changed = true;
        }
        if (snapshot.rateLimits && JSON.stringify(snapshot.rateLimits) !== JSON.stringify(entry.profile.rateLimits)) {
          entry.profile.rateLimits = snapshot.rateLimits;
          entry.profile.rateLimitsUpdatedAt = new Date().toISOString();
          changed = true;
        }
        if (
          this.currentProfile
          && entry.profile.id === this.currentProfile.profile.id
        ) {
          this.currentProfile = entry;
        }
      } catch (error) {
        console.error(`Failed to read Codex account snapshot for ${entry.profile.id}`, error);
      }
    }

    if (changed) {
      for (const entry of this.profiles) {
        await this.writeJson(path.join(storageDirectory, entry.profile.fileName), entry);
      }
    }

    if (changed || forceRender) {
      this.renderUi();
    }
  }
}

function expandHome(filePath: string): string {
  return filePath.startsWith('~/') ? path.join(os.homedir(), filePath.slice(2)) : filePath;
}

function firstNonEmpty(...values: Array<string | undefined>): string {
  return values.find((value) => Boolean(value?.trim()))?.trim() || '';
}

function hashText(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96) || 'profile';
}

function uniqueStrings(values: string[]): string[] {
  return values.filter((value, index) => Boolean(value) && values.indexOf(value) === index);
}

function findExecutablesInPath(pathValue: string): string[] {
  const names = process.platform === 'win32' ? ['codex.cmd', 'codex.exe', 'codex'] : ['codex'];
  const directories = pathValue.split(path.delimiter).filter(Boolean);
  const found: string[] = [];

  for (const directory of directories) {
    for (const name of names) {
      const fullPath = path.join(directory, name);
      if (fs.existsSync(fullPath)) {
        found.push(fullPath);
      }
    }
  }

  return found;
}

function getBundledCodexCandidates(): string[] {
  const extension = vscode.extensions.getExtension(OPENAI_EXTENSION_ID);
  if (!extension) {
    return [];
  }

  const platformDirectory = process.platform === 'darwin'
    ? (process.arch === 'arm64' ? 'macos-aarch64' : 'macos-x64')
    : process.platform === 'win32'
      ? (process.arch === 'arm64' ? 'windows-arm64' : 'windows-x64')
      : process.arch === 'arm64'
        ? 'linux-arm64'
        : 'linux-x64';
  const executable = process.platform === 'win32' ? 'codex.exe' : 'codex';
  return [path.join(extension.extensionPath, 'bin', platformDirectory, executable)];
}

function quoteForShell(value: string): string {
  if (process.platform === 'win32') {
    return /[\s"]/u.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  }
  return /[\s'"]/u.test(value) ? `'${value.replace(/'/g, `'\\''`)}'` : value;
}

async function readAccountSnapshotForAuth(codexCommand: string, auth: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-switch-profile-'));
    const codexHome = path.join(tempRoot, '.codex');
    fs.mkdirSync(codexHome, { recursive: true });
    fs.writeFileSync(path.join(codexHome, 'auth.json'), `${JSON.stringify(auth, null, 2)}\n`, 'utf8');

    const child = spawn(codexCommand, ['app-server', '--listen', 'stdio://'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, HOME: tempRoot },
    });
    const results: AnyObject = {};
    let stdout = '';
    let stderr = '';
    let settled = false;

    const finish = (error?: Error) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      child.kill('SIGTERM');
      fsp.rm(tempRoot, { recursive: true, force: true }).catch(() => undefined);
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    };

    const send = (message: any) => {
      child.stdin.write(`${JSON.stringify(message)}\n`);
    };

    const timer = setTimeout(() => {
      finish(new Error(`Timed out reading app-server snapshot: ${stderr || stdout}`));
    }, APP_SERVER_WAIT_MS);

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
      const lines = stdout.split('\n');
      stdout = lines.pop() || '';

      for (const line of lines) {
        const text = line.trim();
        if (!text) {
          continue;
        }

        try {
          const payload = JSON.parse(text);
          if (payload.id === 2) {
            results.email = payload.result?.account?.email;
            results.planType = payload.result?.account?.planType;
          }
          if (payload.id === 3) {
            results.rateLimits = payload.result?.rateLimits;
            finish();
          }
        } catch {
          // Ignore non-JSON lines.
        }
      }
    });

    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.on('error', (error) => {
      finish(error);
    });

    child.on('exit', (code) => {
      if (!settled && code !== 0) {
        finish(new Error(`app-server exited with code ${code}: ${stderr}`));
      }
    });

    send({ id: 1, method: 'initialize', params: { clientInfo: { name: 'codex-switch', version: '0.0.2' }, protocolVersion: 1 } });
    send({ id: 2, method: 'account/read', params: { refreshToken: false } });
    send({ id: 3, method: 'account/rateLimits/read', params: {} });
  });
}

function formatPlanLabel(profile: any): string {
  return profile.planType ? `套餐: ${profile.planType}` : '';
}

function getQuotaBars(rateLimits: any): any[] {
  const items: any[] = [];
  if (typeof rateLimits?.primary?.usedPercent === 'number') {
    items.push({
      label: '5h剩余',
      remaining: Math.max(0, 100 - rateLimits.primary.usedPercent),
      resetAtLabel: formatResetAt(rateLimits.primary.resetsAt),
    });
  }
  if (typeof rateLimits?.secondary?.usedPercent === 'number') {
    items.push({
      label: '7d剩余',
      remaining: Math.max(0, 100 - rateLimits.secondary.usedPercent),
      resetAtLabel: formatResetAt(rateLimits.secondary.resetsAt),
    });
  }
  return items;
}

function formatResetAt(value: any): string {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return '';
  }

  const timestamp = typeof value === 'number' ? value * 1000 : value;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const manager = new CodexAccountManager(context);
  context.subscriptions.push(manager);
  await manager.activate();
}

export function deactivate(): void {}
