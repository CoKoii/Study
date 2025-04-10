const backet = new Set();
let activeEffect;
const registerEffect = (fn) => {
  activeEffect = fn;
  fn();
};
const data = { num: 0 };

const count = new Proxy(data, {
  get: (target, value) => {
    if (activeEffect) {
      backet.add(activeEffect);
    }
    return target[value];
  },
  set: (target, value, newValue) => {
    target[value] = newValue;
    backet.forEach((fn) => {
      fn();
    });
    return true;
  },
});
registerEffect(() => {
  document.querySelector(".num").innerHTML = count.num;
});
document.querySelector(".add").onclick = () => {
  count.num++;
};
document.querySelector(".sub").onclick = () => {
  count.num--;
};
