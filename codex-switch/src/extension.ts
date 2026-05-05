import * as vscode from 'vscode';
import * as fsp from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

type JsonObject = Record<string, unknown>;

interface Profile {
  id: string;
  label: string;
  email?: string;
  accountId?: string;
  teamId?: string;
  teamName?: string;
  savedAt: string;
  fileName: string;
}

interface StoredProfile {
  version: 2;
  profile: Profile;
  auth: JsonObject;
}

interface ViewState {
  currentProfileId?: string;
  profiles: Profile[];
}

interface ViewMessage {
  command: 'addAccount' | 'refresh' | 'switch' | 'remove';
  id?: string;
}

interface TeamInfo {
  id?: string;
  name?: string;
}

interface OrganizationInfo extends TeamInfo {
  isDefault?: boolean;
}

class AccountsViewProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'codexSwitch.accountsView';

  private view?: vscode.WebviewView;
  private onMessage?: (message: ViewMessage) => void;
  private lastState?: ViewState;

  resolveWebviewView(view: vscode.WebviewView): void {
    this.view = view;
    view.webview.options = { enableScripts: true };
    view.webview.onDidReceiveMessage((message) => {
      this.onMessage?.(message as ViewMessage);
    });

    if (this.lastState) {
      this.view.webview.html = this.getHtml(view.webview, this.lastState);
    }
  }

  setMessageHandler(handler: (message: ViewMessage) => void): void {
    this.onMessage = handler;
  }

  async focus(): Promise<void> {
    await vscode.commands.executeCommand('workbench.view.extension.codexSwitch');
    await vscode.commands.executeCommand(`${AccountsViewProvider.viewType}.focus`);
  }

  render(state: ViewState): void {
    this.lastState = state;
    if (this.view) {
      this.view.webview.html = this.getHtml(this.view.webview, state);
    }
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
      padding: 10px;
      background: var(--bg);
      color: var(--text);
      font: 12px/1.5 var(--vscode-font-family);
    }

    .shell, .list {
      display: grid;
      gap: 8px;
    }

    .toolbar, .summary, .actions, .meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    button {
      appearance: none;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 4px 10px;
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
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--panel);
    }

    .current {
      border-color: var(--accent);
    }

    .account-header {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      align-items: flex-start;
    }

    .title {
      font-size: 13px;
      font-weight: 600;
    }

    .subtle, .summary, .badge, .meta {
      color: var(--muted);
    }

    .meta {
      margin: 6px 0 8px;
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
      <button data-command="refresh">刷新</button>
    </div>

    <div class="summary">
      <span>当前: <strong>${escapeHtml(getCurrentLabel(state))}</strong></span>
      <span>已保存: <strong>${state.profiles.length}</strong></span>
    </div>

    <div class="list" id="profiles"></div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const state = ${payload};
    const container = document.getElementById('profiles');

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderProfiles() {
      if (!state.profiles.length) {
        container.innerHTML = '<div class="empty">还没有保存过账号。</div>';
        return;
      }

      container.innerHTML = state.profiles.map((profile) => {
        const current = profile.id === state.currentProfileId;
        const email = profile.email || profile.accountId || profile.id;

        return \`
          <article class="account \${current ? 'current' : ''}">
            <div class="account-header">
              <div>
                <div class="title">\${escapeHtml(profile.label)}</div>
                <div class="subtle">\${escapeHtml(email)}</div>
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

    document.body.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const command = target.dataset.command;
      if (command) {
        vscode.postMessage({ command, id: target.dataset.id });
      }
    });

    renderProfiles();
  </script>
</body>
</html>`;
  }
}

class CodexAccountManager {
  private readonly statusBar: vscode.StatusBarItem;
  private readonly viewProvider = new AccountsViewProvider();

  constructor(private readonly context: vscode.ExtensionContext) {
    this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.statusBar.command = 'codexSwitch.focusAccountsView';
    context.subscriptions.push(this.statusBar);
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(AccountsViewProvider.viewType, this.viewProvider),
    );
  }

  async activate(): Promise<void> {
    this.registerCommands();
    this.viewProvider.setMessageHandler((message) => {
      void this.handleViewMessage(message);
    });

    await this.getStorageDirectory();
    await this.pruneLegacyProfiles();
    await this.refreshUi();
  }

  dispose(): void {
    // VS Code disposes subscriptions automatically.
  }

  private registerCommands(): void {
    const commands: Array<[string, () => Promise<void>]> = [
      ['codexSwitch.addAccount', () => this.addAccount()],
      ['codexSwitch.switchAccount', () => this.switchByPicker()],
      ['codexSwitch.removeAccount', () => this.removeByPicker()],
      ['codexSwitch.refreshAccounts', () => this.refreshAccounts()],
      ['codexSwitch.focusAccountsView', () => this.viewProvider.focus()],
    ];

    for (const [command, handler] of commands) {
      this.context.subscriptions.push(vscode.commands.registerCommand(command, handler));
    }
  }

  private async handleViewMessage(message: ViewMessage): Promise<void> {
    switch (message.command) {
      case 'addAccount':
        await this.addAccount();
        return;
      case 'refresh':
        await this.refreshAccounts();
        return;
      case 'switch':
        if (message.id) {
          await this.switchToProfile(message.id);
        }
        return;
      case 'remove':
        if (message.id) {
          await this.removeProfile(message.id);
        }
        return;
    }
  }

  private async saveCurrentProfile(showMessage: boolean, messagePrefix = '已保存'): Promise<StoredProfile> {
    const stored = this.createStoredProfile(await this.readAuthFile(this.getAuthFilePath()));
    const targetPath = path.join(await this.getStorageDirectory(), stored.profile.fileName);
    const existing = await this.tryReadStoredProfile(targetPath);

    if (JSON.stringify(existing?.auth) !== JSON.stringify(stored.auth)) {
      await this.writeJson(targetPath, stored);
    }

    await this.refreshUi(stored.profile);
    if (showMessage) {
      void vscode.window.showInformationMessage(`${messagePrefix} ${this.describeProfile(stored.profile)}`);
    }

    return stored;
  }

  private async addAccount(): Promise<void> {
    try {
      await fsp.unlink(this.getAuthFilePath());
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== 'ENOENT') {
        console.error('Failed to remove existing auth.json before login', error);
        void vscode.window.showErrorMessage('删除当前 auth.json 失败，无法开始新增账号。');
        return;
      }
    }

    await this.refreshUi();
    void vscode.window.showInformationMessage('已清除当前 auth.json，请手动登录新账号，登录后点击刷新保存到列表。');
  }

  private async refreshAccounts(): Promise<void> {
    try {
      const current = await this.getCurrentProfile();
      if (current && !(await this.findProfile(current.profile.id))) {
        await this.saveCurrentProfile(true, '已添加账号');
        return;
      }
    } catch {
      // Ignore invalid or missing auth.json during manual refresh.
    }

    await this.refreshUi();
  }

  private async switchByPicker(): Promise<void> {
    const currentId = (await this.getCurrentProfile())?.profile.id;
    const options = (await this.listProfiles()).map(({ profile }) => ({
      label: profile.label,
      detail: `${profile.email ?? profile.accountId ?? profile.id}${profile.id === currentId ? ' · 当前' : ''}`,
      id: profile.id,
    }));

    if (!options.length) {
      void vscode.window.showWarningMessage('还没有已保存的账号');
      return;
    }

    const picked = await vscode.window.showQuickPick(options, {
      placeHolder: '选择要切换到的账号',
    });
    if (picked) {
      await this.switchToProfile(picked.id);
    }
  }

  private async removeByPicker(): Promise<void> {
    const options = (await this.listProfiles()).map(({ profile }) => ({
      label: profile.label,
      detail: profile.email ?? profile.accountId ?? profile.id,
      id: profile.id,
    }));

    if (!options.length) {
      void vscode.window.showWarningMessage('没有可删除的已保存账号');
      return;
    }

    const picked = await vscode.window.showQuickPick(options, {
      placeHolder: '选择要删除的账号',
    });
    if (picked) {
      await this.removeProfile(picked.id);
    }
  }

  private async switchToProfile(id: string): Promise<void> {
    const target = await this.findProfile(id);
    if (!target) {
      void vscode.window.showWarningMessage('没有找到对应的备份');
      return;
    }

    await this.writeJson(this.getAuthFilePath(), target.auth);
    await this.refreshUi(target.profile);
    void vscode.window.showInformationMessage(`已切换到 ${this.describeProfile(target.profile)}`);
  }

  private async removeProfile(id: string): Promise<void> {
    const target = await this.findProfile(id);
    if (!target) {
      void vscode.window.showWarningMessage('没有找到可删除的备份');
      return;
    }

    const confirmed = await vscode.window.showWarningMessage(
      `确认删除 ${this.describeProfile(target.profile)} 吗？`,
      { modal: true },
      '删除',
    );
    if (confirmed !== '删除') {
      return;
    }

    await fsp.unlink(path.join(await this.getStorageDirectory(), target.profile.fileName));
    await this.refreshUi();
    void vscode.window.showInformationMessage(`已删除 ${this.describeProfile(target.profile)}`);
  }

  private async refreshUi(activeProfile?: Profile): Promise<void> {
    const current = activeProfile ?? (await this.getCurrentProfile())?.profile;
    this.statusBar.text = current ? `Codex: ${this.describeProfile(current)}` : 'Codex: 未识别';
    this.statusBar.tooltip = current
      ? `当前配置: ${this.describeProfile(current)}\n点击打开账号管理面板`
      : '点击打开账号管理面板';
    this.statusBar.show();

    this.viewProvider.render({
      currentProfileId: current?.id,
      profiles: (await this.listProfiles()).map(({ profile }) => profile),
    });
  }

  private async getCurrentProfile(): Promise<StoredProfile | undefined> {
    try {
      return this.createStoredProfile(await this.readAuthFile(this.getAuthFilePath()));
    } catch {
      return undefined;
    }
  }

  private async listProfiles(): Promise<StoredProfile[]> {
    const directory = await this.getStorageDirectory();
    const entries = await Promise.all(
      (await fsp.readdir(directory))
        .filter((file) => file.endsWith('.json'))
        .map((file) => this.tryReadStoredProfile(path.join(directory, file))),
    );

    return entries
      .filter((entry): entry is StoredProfile => Boolean(entry))
      .sort((a, b) => this.describeProfile(a.profile).localeCompare(this.describeProfile(b.profile), 'zh-Hans-CN'));
  }

  private async findProfile(id: string): Promise<StoredProfile | undefined> {
    return (await this.listProfiles()).find((entry) => entry.profile.id === id);
  }

  private createStoredProfile(auth: JsonObject): StoredProfile {
    const tokens = this.getTokens(auth);
    const idPayload = this.decodeJwtPayload(tokens.idToken);
    const accessPayload = this.decodeJwtPayload(tokens.accessToken);
    const authClaims = this.readObject(idPayload, 'https://api.openai.com/auth') ??
      this.readObject(accessPayload, 'https://api.openai.com/auth');
    const email =
      this.readString(idPayload, 'email') ??
      this.readNestedString(accessPayload, ['https://api.openai.com/profile', 'email']);
    const accountId =
      this.readString(authClaims, 'chatgpt_account_id') ??
      this.readString(tokens.raw, 'account_id');
    const userId =
      this.readString(authClaims, 'chatgpt_user_id') ??
      this.readString(authClaims, 'user_id') ??
      this.readString(idPayload, 'sub');
    const accountName = this.firstNonEmpty(
      this.readString(idPayload, 'name'),
      email,
      accountId,
      userId,
      'Unknown Account',
    );
    const team = this.readTeam(auth, authClaims);
    const accountKey = this.firstNonEmpty(accountId, email, userId, accountName);
    const teamKey = this.firstNonEmpty(team.id, team.name, 'personal');
    const id = this.slugify(`${accountKey}-${teamKey}-${this.hash(`${accountKey}:${teamKey}`)}`);

    return {
      version: 2,
      profile: {
        id,
        label: accountName,
        email,
        accountId,
        teamId: team.id,
        teamName: team.name,
        savedAt: new Date().toISOString(),
        fileName: `${id}.json`,
      },
      auth,
    };
  }

  private readTeam(auth: JsonObject, authClaims?: JsonObject): TeamInfo {
    const organizations = this.readOrganizations(authClaims);
    const explicitId = this.firstNonEmpty(
      this.readNestedString(auth, ['organization_id']),
      this.readNestedString(auth, ['org_id']),
      this.readString(authClaims, 'organization_id'),
      this.readString(authClaims, 'org_id'),
      this.readString(authClaims, 'workspace_id'),
      this.readString(authClaims, 'team_id'),
    );
    const explicitName = this.firstNonEmpty(
      this.readNestedString(auth, ['organization_name']),
      this.readNestedString(auth, ['org_name']),
      this.readNestedString(auth, ['workspace_name']),
      this.readNestedString(auth, ['team_name']),
    );
    const organization =
      organizations.find((entry) => entry.id && entry.id === explicitId) ??
      organizations.find((entry) => entry.isDefault) ??
      (organizations.length === 1 ? organizations[0] : undefined);

    return {
      id: explicitId ?? organization?.id,
      name: explicitName ?? organization?.name,
    };
  }

  private readOrganizations(authClaims?: JsonObject): OrganizationInfo[] {
    const value = authClaims?.organizations;
    if (!Array.isArray(value)) {
      return [];
    }

    const organizations: OrganizationInfo[] = [];
    for (const entry of value) {
      if (!entry || typeof entry !== 'object') {
        continue;
      }

      const source = entry as Record<string, unknown>;
      const id = typeof source.id === 'string' ? source.id : undefined;
      const name =
        typeof source.title === 'string' ? source.title :
        typeof source.name === 'string' ? source.name :
        undefined;
      const isDefault = typeof source.is_default === 'boolean' ? source.is_default : undefined;

      if (id || name) {
        organizations.push({ id, name, isDefault });
      }
    }

    return organizations;
  }

  private getTokens(auth: JsonObject): { idToken?: string; accessToken?: string; raw: JsonObject } {
    const value = auth.tokens;
    if (!value || typeof value !== 'object') {
      return { raw: {} };
    }

    const tokens = value as JsonObject;
    return {
      idToken: this.readString(tokens, 'id_token'),
      accessToken: this.readString(tokens, 'access_token'),
      raw: tokens,
    };
  }

  private decodeJwtPayload(token?: string): JsonObject | undefined {
    if (!token) {
      return undefined;
    }

    const [, payload] = token.split('.');
    if (!payload) {
      return undefined;
    }

    try {
      const base64 = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(payload.length / 4) * 4, '=');
      return JSON.parse(Buffer.from(base64, 'base64').toString('utf8')) as JsonObject;
    } catch {
      return undefined;
    }
  }

  private readObject(source: JsonObject | undefined, key: string): JsonObject | undefined {
    const value = source?.[key];
    return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonObject) : undefined;
  }

  private readString(source: JsonObject | undefined, key: string): string | undefined {
    const value = source?.[key];
    return typeof value === 'string' ? value : undefined;
  }

  private readNestedString(source: JsonObject | undefined, keys: string[]): string | undefined {
    let current: unknown = source;
    for (const key of keys) {
      if (!current || typeof current !== 'object') {
        return undefined;
      }
      current = (current as Record<string, unknown>)[key];
    }
    return typeof current === 'string' ? current : undefined;
  }

  private firstNonEmpty(...values: Array<string | undefined>): string {
    return values.find((value) => Boolean(value?.trim()))?.trim() ?? '';
  }

  private hash(value: string): string {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  private slugify(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96) || 'profile';
  }

  private describeProfile(profile: Profile): string {
    return profile.label;
  }

  private async readAuthFile(filePath: string): Promise<JsonObject> {
    return JSON.parse(await fsp.readFile(filePath, 'utf8')) as JsonObject;
  }

  private async tryReadStoredProfile(filePath: string): Promise<StoredProfile | undefined> {
    try {
      const parsed = JSON.parse(await fsp.readFile(filePath, 'utf8')) as unknown;
      if (
        parsed &&
        typeof parsed === 'object' &&
        (parsed as StoredProfile).version === 2 &&
        'profile' in parsed &&
        'auth' in parsed &&
        typeof (parsed as StoredProfile).profile?.id === 'string'
      ) {
        return parsed as StoredProfile;
      }
    } catch {
      // Ignore invalid files.
    }

    return undefined;
  }

  private async pruneLegacyProfiles(): Promise<void> {
    const directory = await this.getStorageDirectory();
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

  private async writeJson(filePath: string, value: unknown): Promise<void> {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    await fsp.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  }

  private getAuthFilePath(): string {
    return this.expandHome(this.getConfig('authFilePath', '~/.codex/auth.json'));
  }

  private async getStorageDirectory(): Promise<string> {
    const directory = this.expandHome(this.getConfig('storageDirectory', '~/.codex/auth-profiles'));
    await fsp.mkdir(directory, { recursive: true });
    return directory;
  }

  private getConfig<T>(key: string, fallback: T): T {
    return vscode.workspace.getConfiguration('codexSwitch').get<T>(key, fallback);
  }

  private expandHome(filePath: string): string {
    return filePath.startsWith('~/') ? path.join(os.homedir(), filePath.slice(2)) : filePath;
  }
}

function getCurrentLabel(state: ViewState): string {
  const current = state.profiles.find((profile) => profile.id === state.currentProfileId);
  return current ? current.label : '未识别';
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

export function deactivate(): void {
  // VS Code disposes subscriptions automatically.
}
