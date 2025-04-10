// 收集副作用函数的桶
const bucket = new Set();

// 当前的副作用函数
let activeEffect;

// 注册副作用函数
const effect = (fn) => {
  activeEffect = fn;
  fn();
};

// 初始值
const data = { text: "Hello Vue3!" };

const obj = new Proxy(data, {
  get: (target, value) => {
    if (activeEffect) {
      bucket.add(activeEffect);
    }
    return target[value];
  },
  set: (target, key, value) => {
    target[key] = value;
    bucket.forEach((fn) => fn());
    return true;
  },
});

effect(() => {
  console.log("yeye");
  document.body.innerText = obj.text;
});

setTimeout(() => {
  // obj.text = "Vue is too difficult!";
  obj.notExist = "not exist";
}, 1000);
