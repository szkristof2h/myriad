const { merge } = require("webpack-merge")
const common = require("./webpack.config.js")

module.exports = merge(common(true), {
  mode: "development",
  devtool: "inline-source-map",
  watchOptions: {
    aggregateTimeout: 500, // delay before reloading
    poll: 1000, // enable polling since fsevents are not supported in docker
  },
})
