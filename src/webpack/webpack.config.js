const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const webpack = require("webpack")
const dotenv = require("dotenv").config({
  path: path.join(__dirname + "../../../" + ".env"),
})

module.exports = devMode => {
  return {
    entry: {
      app: "./src/app/index.js",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: ["babel-loader"],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: { importLoaders: 1 },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ["file-loader"],
        },
      ],
    },
    resolve: { extensions: [".js", ".jsx", ".tsx", ".ts", ".json", ".mjs"] },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/public/index.html",
        filename: "./index.html",
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? "[name].css" : "[name].[hash].css",
        chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
      }),
      new webpack.DefinePlugin({
        "process.env.SITE_URL": JSON.stringify(dotenv.parsed.SITE_URL),
        "process.env.PORT": JSON.stringify(dotenv.parsed.PORT),
      }),
    ],
    output: {
      filename: "[name].bundle.js",
      chunkFilename: "[name].bundle.js",
      path: path.resolve(__dirname, "../dist/bundles"),
      publicPath: "/",
    },
    stats: {
      colors: true,
    },
  }
}
