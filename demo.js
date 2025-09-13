"use strict";

function* generatorFn() {}
const g = generatorFn();
console.log(g);
console.log(g.next());
