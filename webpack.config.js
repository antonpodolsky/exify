const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const chrome = {
  mode: 'production',
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
    disableHostCheck: true,
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
      { from: './src/overlay.css', to: 'chrome/' },
    ]),
  ],
  module: {
    rules: [{ test: /\.ts?$/, loader: 'ts-loader' }],
  },
};

const web = {
  mode: 'production',
  entry: {
    web: './src/web.ts',
  },
  output: {
    filename: '[name]/bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist',
  },
  devServer: {
    disableHostCheck: true,
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
