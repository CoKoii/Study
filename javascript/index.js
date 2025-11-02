"use strict";
let p = new Promise((resolve, reject) => {
  console.log("我是promise的执行器函数");
  resolve("成功了");
});
console.log(p);
