var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  mode: 'production',
  plugins: [
    new UglifyJSPlugin()
  ]
};
