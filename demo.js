"use strict";

let dest = {};
let src = { id: "src" };

let result = Object.assign(dest, src);

console.log(result);
console.log(dest);
console.log(src);
dest.id = "dest";
console.log(result);
console.log(dest);
console.log(src);
console.log(dest.id === result.id);
console.log(dest.id === src.id);
