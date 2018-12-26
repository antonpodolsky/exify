const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const extend = conf => {
  return {
    ...conf,
    mode: 'production',
    output: {
      ...conf.output,
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
    module: {
      rules: [
        { test: /\.ts?$/, loader: 'ts-loader' },
        { test: /\.css?$/, loader: ['style-loader', 'css-loader'] },
      ],
    },
    plugins: [new CleanWebpackPlugin(['dist']), ...(conf.plugins || [])],
  };
};

const addon = (
  browser // chrome | firefox
) =>
  extend({
    entry: {
      background: `./src/${browser}/background.ts`,
      content: `./src/${browser}/content.ts`,
    },
    output: {
      filename: `${browser}/[name].js`,
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: './manifest.json', to: `${browser}/` },
        { from: './src/overlay/overlay.css', to: `${browser}/` },
        { from: './src/icons', to: `${browser}/icons` },
      ]),
    ],
  });

const web = extend({
  entry: {
    web: './src/web.ts',
  },
  output: {
    filename: '[name]/bundle.js',
  },
});

module.exports = [addon('chrome'), addon('firefox'), web];
