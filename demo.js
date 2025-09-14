"use strict";

function* generatorFn() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}
generatorFn().forEach((element) => {
  console.log(element);
});
