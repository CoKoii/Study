const bucket = new WeakMap();

let activeEffect;

const registerEffect = (fn) => {
  const effect = () => {
    cleanup(effect);
    activeEffect = effect;
    fn();
  };
  effect.deps = [];
  effect();
  console.dir(effect);
};
const cleanup = (effect) => {
  for (let i = 0; i < effect.deps.length; i++) {
    const deps = effect.deps[i];
    deps.delete(effect);
  }
  effect.deps.length = 0;
};
const track = (target, key) => {
  if (!activeEffect) return target[key];
  let map = bucket.get(target);
  if (!map) {
    bucket.set(target, (map = new Map()));
  }
  let set = map.get(key);
  if (!set) {
    map.set(key, (set = new Set()));
  }
  set.add(activeEffect);
  activeEffect.deps.push(set);
  console.log(bucket);
};

const trigger = (target, key) => {
  const map = bucket.get(target);
  if (!map) return true;
  const functions = map.get(key);
  const functionsToRun = new Set(functions);
  if (functionsToRun) {
    functionsToRun.forEach((fn) => {
      fn();
    });
  }
  return true;
};

const number = { num: 0, ok: true };

const count = new Proxy(number, {
  get: (target, key) => {
    track(target, key);
    return target[key];
  },
  set: (target, key, value) => {
    target[key] = value;
    trigger(target, key);
  },
});

registerEffect(() => {
  document.querySelector(".num").innerHTML = count.ok ? count.num : -1;
});
document.querySelector(".add").addEventListener("click", () => {
  count.num++;
});
document.querySelector(".sub").addEventListener("click", () => {
  count.num--;
});
