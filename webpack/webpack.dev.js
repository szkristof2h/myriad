const merge = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common(true), {
  mode: 'development',
  devtool: 'inline-source-map'
});
