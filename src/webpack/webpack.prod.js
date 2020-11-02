const { merge } = require("webpack-merge")
const common = require("./webpack.config.js")

module.exports = merge(common(false), {
  mode: "production",
  devtool: false,
})
