const REG = /<script>([\s\S]+?)<\/script>/;
module.exports = function (source) {
  const __source = source.match(REG);
  return __source && __source[1] ? __source[1] : source;
};
