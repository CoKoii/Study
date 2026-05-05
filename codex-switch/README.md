# codex账号助手

VS Code extension for saving and switching multiple Codex `auth.json` accounts inside VS Code.

## Features

- Launches the official `codex login` OpenAI sign-in flow directly from VS Code
- Saves each account as an independent profile
- Switches by overwriting the live `auth.json`
- Restarts the OpenAI Codex extension host after account switching so the login state takes effect immediately
- Shows the current account in the status bar
- Includes a sidebar manager with one-click add/switch/delete actions
- Ignores and removes legacy profile files from older formats

## Commands

- `codex账号助手: 添加账号`
- `codex账号助手: 切换账号`
- `codex账号助手: 删除账号`
- `codex账号助手: 打开账号面板`

## Settings

- `codexSwitch.authFilePath`
- `codexSwitch.storageDirectory`
- `codexSwitch.codexPath`
- `codexSwitch.openaiExtensionRefreshStrategy`
