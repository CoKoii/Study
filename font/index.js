const createFontSlice = require('font-slice');
const path = require('path');

createFontSlice({
  // fontPath
  fontPath: path.resolve(__dirname, 'LXGWWenKai-Medium.ttf'),
  // outputDir
  outputDir: path.resolve(__dirname, './output'),
})