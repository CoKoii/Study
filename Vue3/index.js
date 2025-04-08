import utils from "./utils.js";
utils.registerErrorHandler((error) => {
  console.error("hahahaah:", error);
});
utils.foo(() => {
  console.log(a + b);
});
