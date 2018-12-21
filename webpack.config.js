const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const chrome = {
  mode: 'none',
  entry: {
    background: './src/chrome/background.ts',
    content: './src/chrome/content.ts',
  },
  output: {
    filename: 'chrome/[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist',
  },
  devServer: {
    contentBase: './src',
    noInfo: false,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      { from: './src/chrome/manifest.json', to: 'chrome/' },
    ]),
  ],
  module: {
    rules: [{ test: /\.ts?$/, loader: 'ts-loader' }],
  },
};

const web = {
  mode: 'none',
  entry: {
    web: './src/web.ts',
  },
  output: {
    filename: '[name]/bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist',
  },
  devServer: {
    contentBase: './src',
    noInfo: false,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [],
  module: {
    rules: [{ test: /\.ts?$/, loader: 'ts-loader' }],
  },
};

module.exports = [chrome, web];
