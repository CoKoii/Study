# Vue.js3 的设计思路

## 渲染器

将虚拟 DOM 转为真实 DOM

```js
const vnode = {
  tag: "div",
  props: {
    onClick: () => {
      alert("hello");
    },
  },
  children: "click me",
};

//tag:标签名称
//props:属性，事件
//children:子节点
```

```js{2,5,9,11,12,15}
const render = (vnode, container) => {
  const el = document.createElement(vnode.tag);
  for (let key in vnode.props) {
    if (String(key).slice(0, 2) === "on") {
      el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]);
    }
  }
  if (typeof vnode.children === "string") {
    el.appendChild(document.createTextNode(vnode.children));
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach((child) => {
      render(child, el);
    });
  }
  container.appendChild(el);
};

render(vnode, document.body);
```

这是手搓的一个简易版的虚拟 DOM 转真实 DOM 的方法

`vnode` 接收一个虚拟 DOM

`container` 真实 DOM 的挂载容器

---

1. 根据 tag 创建一个标签为 `div` 的元素

2. 遍历 props，如果 key 的前两个字符是 `on` ，代表它是一个事件，而 key 的 value 则是事件的逻辑

3. 给元素添加事件监听，将 自定义的 `onClick` 事件转为原生的 `click` 事件，将逻辑同步给事件监听

4. 判断虚拟 DOM 的 children 是否是字符串，是就直接挂载文字，如果是个数组，意味着还存在子元素，那就执行回调，直至处理完所有的子元素

5. 最终将处理好的真实 DOM 挂载到容器上

::: tip 思考

- `click me` 改成 `click again`，渲染器如何找到变动的地方并且只更新变更的内容？

:::
