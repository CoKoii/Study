# Markdown 语法指南

## 标题语法

# 一级标题

## 二级标题

### 三级标题

```md
# 一级标题

## 二级标题

### 三级标题
```

## 文本样式

**粗体文本**
_斜体文本_
~~删除线文本~~
`代码文本`

```md
**粗体文本**
_斜体文本_
~~删除线文本~~
`代码文本`
```

## 列表

- 无序列表项
- 另一个列表项
  - 嵌套列表项

1. 有序列表项
2. 第二个项目
   1. 嵌套有序列表

```md
- 无序列表项
- 另一个列表项
  - 嵌套列表项

1. 有序列表项
2. 第二个项目
   1. 嵌套有序列表
```

## 链接和图片

[链接文本](https://example.com)
![图片描述](/book.svg)

```md
[链接文本](https://example.com)
![图片描述](/book.svg)
```

## 引用

> 这是一段引用文本
> 可以有多行

```md
> 这是一段引用文本
> 可以有多行
```

## 代码块

```javascript
function hello() {
  console.log("Hello World!");
}
```

````md
```javascript
function hello() {
  console.log("Hello World!");
}
```
````

## 表格

| 表头 1   | 表头 2   |
| -------- | -------- |
| 单元格 1 | 单元格 2 |
| 单元格 3 | 单元格 4 |

```md
| 表头 1   | 表头 2   |
| -------- | -------- |
| 单元格 1 | 单元格 2 |
| 单元格 3 | 单元格 4 |
```

## 分隔线

---

```md
---
```

## 任务列表

- [x] 已完成任务
- [ ] 未完成任务

```md
- [x] 已完成任务
- [ ] 未完成任务
```

## VitePress 特有语法

### Emoji 表情

:smile: :heart: :thumbsup:

```md
:smile: :heart: :thumbsup:
```

### 自定义容器

::: info
这是一个信息容器
:::

::: tip
这是一个提示容器
:::

::: warning
这是一个警告容器
:::

::: danger
这是一个危险容器
:::

::: details
这是一个详情容器
:::

```md
::: info
这是一个信息容器
:::

::: tip
这是一个提示容器
:::

::: warning
这是一个警告容器
:::

::: danger
这是一个危险容器
:::

::: details
这是一个详情容器
:::
```

### 代码块行高亮

```js{1,4,6-8}
console.log('highlighted')
console.log('not highlighted')
console.log('not highlighted')
console.log('highlighted')
console.log('not highlighted')
console.log('highlighted')
console.log('highlighted')
console.log('highlighted')
```

显示原始语法：

````md
```js{1,4,6-8}
console.log('highlighted')
console.log('not highlighted')
console.log('not highlighted')
console.log('highlighted')
console.log('not highlighted')
console.log('highlighted')
console.log('highlighted')
console.log('highlighted')
```
````

### 代码组

::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
};
```

```ts [config.ts]
import type { UserConfig } from "vitepress";

const config: UserConfig = {
  // ...
};
```

:::

显示原始语法：

````md
::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
};
```

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig is {
  // ...
}
```

:::
````

### 导入代码片段

<<< ../../.vitepress/NotesConfig/index.js{4} [示例代码]

```md
<<< ../../.vitepress/NotesConfig/index.js{4} [示例代码]
```
