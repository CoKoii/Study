# 项目代码风格约定

后续新增或修改代码时，遵循当前项目写法：简单、直接、极致模块化。

## 模块化原则

- 页面入口 `views/**/index.vue` 只负责引用组件、组合布局、传参和事件连接。
- 页面入口不写模块内部 DOM、业务实现、展示细节或复杂逻辑。
- 页面样式 `views/**/index.scss` 只负责页面布局和模块之间的间距、尺寸、排列。
- 子组件负责自己的模板、逻辑、状态和内部样式。
- 能放进子组件的实现，不放在页面入口；能属于模块内部的样式，不放在页面样式。

## Vue 组件

- 使用 Vue 3 SFC。
- 统一使用 `<script setup lang="ts"></script>`。
- SFC 顺序固定为 `script`、`template`、`style`。
- 即使暂时没有脚本逻辑，也保留空的 `script setup`。
- 样式默认使用 `<style scoped lang="scss">`。
- 组件样式通过 `@use './index.scss';` 引入同级样式文件。
- 页面入口模板只放子组件，不展开模块内部结构。

```vue
<script setup lang="ts"></script>

<template>
  <div class="home">
    <UserProfile />
    <ProjectList />
  </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
```

## 样式系统

- 各页面和组件样式优先引用 `src/styles` 中维护的 CSS 变量，保证主题和布局一致。
- `src/styles` 按 CSS 职责拆分并独立维护。
- `color.scss` 只负责颜色、主题色、文字色、边框色、背景色等颜色变量。
- `layout.scss` 只负责全局布局、间距、尺寸、圆角、层级等布局变量。
- `base.scss` 只负责全局基础样式和浏览器默认样式重置。
- `main.scss` 只负责汇总全局样式入口。
- 页面和组件内不随意写散落的颜色值、间距值、尺寸值，优先使用变量。
- 保证整体主题、间距、布局节奏一致。

布局优先级：

```text
Antdv Next 组件布局 > flex / grid > 其他布局方式
```

- 布局方面尽量使用 Antdv Next 组件实现。
- 无法用组件布局时，至少使用 `flex` 或 `grid`。
- 不允许使用大量固定 `px` 堆布局。
- 固定尺寸只在必要场景使用，布局应尽量具备自适应能力。

## 图标

- 图标统一使用 Iconify。
- 项目内优先使用全局共享组件 `src/components/AppIcon`。
- 不在业务组件中直接复制 SVG 或手写图标。
- 图标名称使用 Iconify 标准格式，例如 `lucide:home`、`ant-design:user-outlined`。
- 图标颜色默认继承当前文字颜色，尺寸通过组件参数控制。

## 功能实现

- 组合式功能优先使用 VueUse。
- 能用 `@vueuse/core` 稳定实现的能力，不手写重复逻辑。
- 常见能力如存储、媒体查询、窗口尺寸、事件监听、防抖节流、剪贴板、鼠标键盘、请求状态等，先查 VueUse。
- VueUse 无法覆盖或不适合时，再使用成熟库或项目内封装。
- 只有在现有方案不满足需求时，才手写实现。

## 目录结构

- 页面目录使用 `index.vue` 作为入口组件。
- 页面样式使用同级 `index.scss`。
- 页面相关模块放在当前页面的 `components` 目录。
- 子组件目录使用语义化组件名，并在目录内使用 `index.vue`、`index.scss`。
- 同一页面或菜单内复用的代码放在当前页面目录的 `share` 中。
- 多个页面复用的代码放在 `src` 下的全局共享目录中。

```text
src/views/home/
├── index.vue
├── index.scss
├── share/
│   ├── components/
│   ├── styles/
│   └── utils/
└── components/
    └── UserProfile/
        ├── index.vue
        └── index.scss
```

复用边界：

```text
单个模块私有：src/views/home/components/UserProfile/**
当前页面复用：src/views/home/share/**
跨页面复用：src/components、src/styles、src/utils
```

## 命名

- 使用语义化命名，不使用临时占位名。
- 子组件在模板中使用 PascalCase。
- 根节点 class 使用能表达页面或模块含义的名称。
- 页面入口组件允许使用 `index`。

## 编码倾向

- 不提前抽象，不写暂时用不到的逻辑。
- 优先沿用已有目录结构和写法。
- 功能实现优先级为 `VueUse > 成熟库或项目封装 > 手写实现`。
- 涉及 Antdv Next 组件、布局、主题 token 或组件 API 时，优先使用项目已安装的 `antdv-next` skill。
- 修改范围保持最小，只改与当前需求相关的文件。
