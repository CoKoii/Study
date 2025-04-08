let handleError = null;
const callWithErrorHandling = (fn) => {
  try {
    fn && fn();
  } catch (error) {
    handleError(error);
  }
};
export default {
  foo: (fn) => {
    callWithErrorHandling(fn);
  },
  registerErrorHandler: (handler) => {
    handleError = handler;
  },
};
