const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const webpack = (conf, { extractCss } = { extractCss: false }) => {
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

const browser = (
  type // webkit | firefox
) =>
  webpack(
    {
      entry: {
        background: `./src/extension/${type}/background.ts`,
        content: `./src/extension/${type}/content.ts`,
        popup: `./src/extension/${type}/popup.ts`,
      },
      output: {
        filename: `${type}/[name].js`,
      },
      plugins: [
        new CopyWebpackPlugin([
          { from: './manifest.json', to: `${type}/` },
          { from: './src/icons', to: `${type}/icons` },
          { from: './src/extension/shared/popup.html', to: `${type}/` },
        ]),
        new MiniCssExtractPlugin({
          filename: `./${type}/[name].css`,
        }),
        new ZipPlugin({
          filename: `exify-${type}.zip`,
          pathMapper(assetPath) {
            return assetPath.replace(`${type}/`, '');
          },
        }),
      ],
    },
    { extractCss: true }
  );

const web = webpack({
  entry: {
    web: './src/web/web.ts',
  },
  output: {
    filename: '[name]/bundle.js',
  },
  plugins: [new CleanWebpackPlugin(['dist'])],
});

module.exports = [web, browser('webkit'), browser('firefox')];
