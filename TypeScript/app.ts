const error = (): never => {
  throw new Error("This is an error");
};
const error2 = (): never => {
  error2();
};
