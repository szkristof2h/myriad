const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = devMode => {
  return {
    entry: {
      app: "./src/app/index.js"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: ["babel-loader"],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader
            },
            {
              loader: "css-loader",
              options: { importLoaders: 1 }
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: [
                  require("autoprefixer"),
                  require("postcss-simple-vars"),
                  require("postcss-nested")
                ]
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ["file-loader"]
        }
      ]
    },
    resolve: { extensions: [".js", ".jsx", ".tsx", ".ts", ".json"] },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/public/index.html",
        filename: "./index.html"
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? "[name].css" : "[name].[hash].css",
        chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
      }),
      new webpack.DefinePlugin({
        "process.env.SITE_URL": JSON.stringify(process.env.SITE_URL),
        "process.env.PORT": JSON.stringify(process.env.PORT)
      })
    ],
    output: {
      filename: "[name].bundle.js",
      chunkFilename: "[name].bundle.js",
      path: path.resolve(__dirname, "../dist"),
      publicPath: "/"
    }
  };
};
