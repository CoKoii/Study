const { ConcatSource } = require("webpack-sources");

class FooterPlugin {
  constructor(options) {
    this.options = options;
    console.log("FooterPlugin", options);
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("FooterPlugin", (compilation) => {
      compilation.hooks.processAssets.tap("FooterPlugin", () => {
        for (const chunk of compilation.chunks) {
          for (const file of chunk.files) {
            console.log("file", file);
            const comment = `\n/* ${this.options.banner} */\n`;
            compilation.updateAsset(file, (old) => {
              return new ConcatSource(old, "\n", comment);
            });
          }
        }
      });
    });
  }
}
module.exports = FooterPlugin;
