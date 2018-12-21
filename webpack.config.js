const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist',
  },
  devServer: {
    contentBase: './src',
    noInfo: false,
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [],
  module: {
    rules: [
      { test: /\.ts?$/, loader: 'ts-loader' }
    ]
  }
};