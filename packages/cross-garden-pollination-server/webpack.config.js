const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  target: "node",
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" },
    ],
  },
  externals: [
    (context, request, callback) => {
      if (/^aws-sdk/.test(request)) {
        // aws-sdk is provided by default so we don't have to bundle it
        return callback(null, `commonjs ${request}`);
      }
      return callback();
    },
  ],
};
