"use strict";

const number = [3, -2, -6, -1, "error", 9, 13, 17, 15, 14, 9, 5];
let max = number[0];
let min = number[0];
for (let i = 0; i < number.length; i++) {
  if (number[i] > max) max = number[i];
  if (number[i] < min) min = number[i];
}
console.log(`Max: ${max}`);
console.log(`Min: ${min}`);
