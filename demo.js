"use strict";

const outer = () => {
  inner();
};
const inner = () => {
  console.log(inner.caller);
};
outer();
