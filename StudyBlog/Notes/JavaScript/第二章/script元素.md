# Script 元素

## Script

JavaScript 主要通过`<script>`元素插入 HTML。主要属性如下：

- `async`: 异步加载脚本
  - 不阻塞页面解析
  - 下载完成后立即执行
  - 适用于独立的脚本，如统计分析代码
- `defer`: 延迟执行脚本
  - 不阻塞页面解析
  - 等待页面解析完成后，按顺序执行
  - 适用于需要操作 DOM 的脚本
- `src`: 可以用过链接引入外部 `JavaScript` 文件
- `type`: 脚本 MIME 类型，当 `type` 为 `module` 时，代码中才能使用 `import` 和 `export` 关键字

### **行内 JavaScript**

::: code-group

```html{9-11}
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>
      console.log("Hello,JavaScript"); //输出 Hello,JavaScript
    </script>
  </body>
</html>
```

```html {6,14} [注意]
<!-- 在使用行内JavaScript时，代码中不能出现字符串：</script> -->

<!-- 下列代码会报错： -->

<script>
  console.log("</script>");
</script>

<!-- 浏览器解析到字符串</script>时，会将其当成结束的</script>标签 -->

<!-- 想避免这个问题，只需要转义字符'\'即可 -->

<script>
  console.log("<\/script>");
</script>

```

:::

### **行外 JavaScript**

::: code-group

```html {9} [引入本地 js]
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./vue.js"></script>
  </body>
</html>
```

```js [vue.js]
console.log("hello,javascript");
```

```html {9} [引入外部 js]
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </body>
</html>
```

:::

::: warning 注意
使用了`src`属性的`<script>`元素不应该再在`<script>`和`</script>`之间再包含其他代码，即使有，也会被浏览器忽略
:::
