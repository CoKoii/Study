const bucket = new WeakMap();

let acctiveEffect;

const registerEffect = (fn) => {
  acctiveEffect = fn;
  fn();
};

const number = { num: 0 };

const count = new Proxy(number, {
  get: (target, key) => {
    if (!acctiveEffect) return target[key];
    let map = bucket.get(target);
    if (!map) {
      bucket.set(target, (map = new Map()));
    }
    let set = map.get(key);
    if (!set) {
      map.set(key, (set = new Set()));
    }
    set.add(acctiveEffect);
    return target[key];
  },
  set: (target, key, value) => {
    target[key] = value;
    const map = bucket.get(target);
    if (!map) return true;
    const functions = map.get(key);
    functions.forEach((fn) => {
      fn();
    });
  },
});

registerEffect(() => {
  document.querySelector(".num").textContent = count.num;
});
document.querySelector(".add").addEventListener("click", () => {
  count.num++;
});
document.querySelector(".sub").addEventListener("click", () => {
  count.num--;
});
