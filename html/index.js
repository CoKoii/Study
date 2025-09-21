"use strict";

const p1 = new Promise((resolve, reject) => {
  resolve("ok");
});
const result = p1.then(
  (value) => {
    return value;
  },
  (error) => {
    return error;
  }
);
console.log(result);
