const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const extend = (conf, { extractCss } = { extractCss: false }) => {
  return {
    ...conf,
    mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
    output: {
      ...conf.output,
      path: path.resolve(__dirname, './dist'),
      publicPath: '/dist',
    },
    devServer: {
      disableHostCheck: true,
      contentBase: './src/web',
      noInfo: false,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        { test: /\.ts?$/, loader: 'ts-loader' },
        {
          test: /\.css?$/,
          loader: [
            ...(extractCss ? [MiniCssExtractPlugin.loader] : ['style-loader']),
            ...['css-loader'],
          ],
        },
        {
          test: /\.scss?$/,
          loader: [
            ...(extractCss ? [MiniCssExtractPlugin.loader] : ['style-loader']),
            ...['css-loader', 'sass-loader'],
          ],
        },
      ],
    },
    plugins: conf.plugins,
  };
};

const extension = (
  browser // webkit | firefox
) =>
  extend(
    {
      entry: {
        background: `./src/extension/${browser}/background.ts`,
        content: `./src/extension/${browser}/content.ts`,
        popup: `./src/extension/${browser}/popup.ts`,
      },
      output: {
        filename: `${browser}/[name].js`,
      },
      plugins: [
        new CopyWebpackPlugin([
          { from: './manifest.json', to: `${browser}/` },
          { from: './src/icons', to: `${browser}/icons` },
          { from: './src/extension/shared/popup.html', to: `${browser}/` },
        ]),
        new MiniCssExtractPlugin({
          filename: `./${browser}/[name].css`,
        }),
      ],
    },
    { extractCss: true }
  );

const web = extend({
  entry: {
    web: './src/web/web.ts',
  },
  output: {
    filename: '[name]/bundle.js',
  },
  plugins: [new CleanWebpackPlugin(['dist'])],
});

module.exports = [web, extension('webkit'), extension('firefox')];
