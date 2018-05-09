var merge = require('webpack-merge');
var dev = require('./webpack.dev.js');
var prod = require('./webpack.prod.js');
var path = require('path');
var production = process.env.NODE_ENV == 'production';
var config = {
  entry: './src/client/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public/scripts')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react']
          }
        }
      }
    ]
  }
};

module.exports = merge(production ? prod : dev, config);
