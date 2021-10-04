var { merge } = require('webpack-merge');
var dev = require('./webpack.dev.js');
var prod = require('./webpack.prod.js');
var path = require('path');
var dist = path.join(__dirname, 'dist');
var production = process.env.NODE_ENV == 'production';
var env = production ? prod : dev;

var config = {
  entry: './src/client/main.jsx',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist/scripts')
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/react']
          }
        }
      }
    ]
  }
};

module.exports = merge(config, env);
