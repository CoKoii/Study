"use strict";

const target = {
  foo: "bar",
};
const proxy = new Proxy(target, {
  get: Reflect.get(...arguments),
});

console.log(proxy.foo);
