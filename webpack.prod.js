var webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  mode: 'production',
  optimizaiton: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};
