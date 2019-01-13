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

const extension = (
  browser // webkit | firefox
) =>
  extend({
    entry: {
      background: `./src/extension/${browser}/background.ts`,
      content: `./src/extension/${browser}/content.ts`,
    },
    output: {
      filename: `${browser}/[name].js`,
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: './manifest.json', to: `${browser}/` },
        {
          from: './node_modules/dialog-polyfill/dialog-polyfill.css',
          to: `${browser}/`,
        },
        { from: './src/views/exify.css', to: `${browser}/` },
        { from: './src/views/exif/exif.css', to: `${browser}/` },
        { from: './src/views/overlay/overlay.css', to: `${browser}/` },
        { from: './src/views/settings/settings.css', to: `${browser}/` },
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

module.exports = [extension('webkit'), extension('firefox'), web];
