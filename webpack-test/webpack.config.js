const path = require("path");
const webpack = require("webpack");
const FooterPlugin = require("./plugin/FooterPlugin");
module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.imooc$/,
        use: [path.resolve(__dirname, "loader/imoocLoader.js")],
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: "欢迎学习慕课网前端工程化课程",
    }),
    new FooterPlugin({
      banner: "Sam老师出品",
    }),
  ],
};
