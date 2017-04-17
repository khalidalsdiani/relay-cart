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


module.exports = {
  // devtool: 'eval',
  devtool: 'source-map',

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
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'sass-loader?sourceMap=true',
            'postcss-loader',
          ],
        }),
        include: stylePaths,
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?.*$/,
        use: 'file-loader?limit=100000&minetype=application/font-woff',
        include: fontPaths,
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?.*$/,
        use: 'file-loader',
        include: fontPaths,
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin({ filename: '[name].css', allChunks: true }),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],

};
