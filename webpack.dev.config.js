/**
 * Created by Soon on 2/22/16.
 */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rootPath = path.resolve('.');
const outputPath = path.join(rootPath, 'dist', 'dev', 'public');

const jsPath = path.join(rootPath, 'js');

const stylePaths = [
  path.join(jsPath, 'components'),
  path.join(rootPath, 'node_modules', 'normalize.css'),
  path.join(rootPath, 'node_modules', 'ionicons', 'dist', 'scss'),
];

const fontPaths = [
  path.join(rootPath, 'node_modules', 'ionicons', 'dist', 'fonts'),
];

const extractCSS = new ExtractTextPlugin({ filename: '[name].css', allChunks: true });

module.exports = {
  // devtool: 'eval',
  devtool: 'source-map',
  debug: true,
  watch: true,
  colors: true,

  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    './js/app.js',
  ],

  output: {
    filename: '[name].js',
    path: outputPath,
    publicPath: '/public/',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/,
        loader: extractCSS.extract({
          fallbackLoader: 'style',
          loader: [
            'css',
            'sass?sourceMap=true',
            'postcss',
          ],
        }),
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?.*$/,
        loader: 'file-loader?limit=100000&minetype=application/font-woff',
        include: fontPaths,
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?.*$/,
        loader: 'file-loader',
        include: fontPaths,
      },
    ],
  },

  plugins: [
    extractCSS,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],

};
