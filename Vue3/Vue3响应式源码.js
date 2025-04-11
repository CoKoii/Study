const bucket = new WeakMap();

let acctiveEffect;

const registerEffect = (fn) => {
  acctiveEffect = fn;
  fn();
};

const number = { num: 0 };

const count = new Proxy(number, {
  get: (target, key) => {
    bucket.set(target, (despMap = new Map()));
    despMap.set(key, (deps = new Set()));
    deps.add(acctiveEffect);
    return target[key];
  },
  set: (target, key, value) => {
    target[key] = value;
    const despMap = bucket.get(target);
    const effects = despMap.get(key);
    effects.forEach((effect) => {
      effect();
    });
    return true;
  },
});

registerEffect(() => {
  document.querySelector(".num").innerHTML = count.num;
});
document.querySelector(".add").addEventListener("click", () => {
  count.num++;
});
document.querySelector(".sub").addEventListener("click", () => {
  count.num--;
});
