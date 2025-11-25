# 3D 粒子手势交互系统

这是一个基于 Three.js 和 MediaPipe 的实时交互 3D 粒子系统。

## 功能特点

- **手势控制**: 使用摄像头检测双手，张开/合拢双手可控制粒子的扩散和缩放。
- **多模型切换**: 支持爱心、花朵和自定义文字模型。
- **实时交互**: 粒子系统实时响应手势变化。
- **自定义**: 支持调整粒子颜色和输入自定义文字。

## 如何运行

由于项目使用了 ES Modules 和摄像头权限，需要通过本地服务器运行，不能直接双击打开 `index.html`。

### 方法 1: 使用 VS Code Live Server 插件 (推荐)

1. 在 VS Code 中安装 "Live Server" 插件。
2. 右键点击 `particle-system/index.html`。
3. 选择 "Open with Live Server"。

### 方法 2: 使用 Python 启动简单服务器

如果你安装了 Python，可以在终端中运行：

```bash
cd particle-system
python3 -m http.server
```

然后访问 `http://localhost:8000`。

### 方法 3: 使用 Node.js http-server

```bash
npx http-server particle-system
```

## 注意事项

- 请允许浏览器访问摄像头权限。
- 首次加载 MediaPipe 模型可能需要几秒钟。
- 确保光线充足，以便摄像头能准确识别手势。
