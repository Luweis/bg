const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const env = process.env.NODE_ENV || 'development';
const publicPath = '/assets/';

const filename = env === 'development' ? '[name]' : '[name].[hash]';

module.exports = {
  mode: env,
  entry: {
    main: path.resolve('./assets/js/index'),
    doctors: path.resolve('./assets/js/consultDoctor'),
    doctor: path.resolve('./assets/js/doctorHomePage'),
    operation: path.resolve('./assets/js/operationOrder'),
    search: path.resolve('./assets/js/searchDoctor'),
    swiper: path.resolve('./assets/swiper')
  },
  output: {
    filename: `${filename}.js`,
    chunkFilename: `${filename}.js`,
    path: path.resolve('./public/assets/'),
    publicPath,
  },
  target: 'web',
  resolve: {
    modules: [
      'node_modules',
      path.resolve('./assets'),
    ],
    extensions: ['.js', '.css', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve('./assets')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
          }
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { minimize: env === 'production' } },
          'sass-loader',
        ],
      },
      {
        test: /\.(jpg|png)$/,
        include: [path.resolve('./assets')],
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]',
          },
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: path.resolve('./assets'),
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new ManifestPlugin({ publicPath }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from: path.resolve('./assets/images/*.*'), to: './images/', flatten: true },
    ]),
    new MiniCssExtractPlugin({
      filename: `${filename}.css`,
      chunkFilename: `${filename}.css`,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ]
};
