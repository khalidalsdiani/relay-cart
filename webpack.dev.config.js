/**
 * Created by Soon on 2/22/16.
 */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const autoprefixer = require('autoprefixer');

const rootPath = path.join(__dirname);
const outputPath = path.join(rootPath, 'dist', 'dev', 'public');

const jsPath = path.join(rootPath, 'js');

const stylePaths = [
  path.join(jsPath, 'components', 'styles'),
  path.join(rootPath, 'node_modules', 'normalize.css'),
  path.join(rootPath, 'node_modules', 'ionicons', 'scss'),
];

const fontPaths = [
  path.join(rootPath, 'node_modules', 'ionicons', 'fonts'),
];

module.exports = {
  devtool: 'eval',
  // devtool: 'source-map',
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
        query: {
          plugins: ['./build/babelRelayPlugin'],
          presets: ['es2015', 'react', 'stage-0'],
        },
        include: [path.join(__dirname, 'js'), path.join(rootPath, 'node_modules')],
      },
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract(
          // activate source maps via loader query
          'css?sourceMap!postcss!sass?outputStyle=expanded&sourceMap'
        ),
        include: stylePaths,
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
      { test: /\.png$/, loader: 'file-loader?limit=100000' },
      { test: /\.jpg$/, loader: 'file-loader' },
    ],
  },

  postcss: ()=> [autoprefixer],

  resolve: {
    root: rootPath,
    modulesDirectories: ['js', 'node_modules'],
    extensions: ['', '.js'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css'),
    new StatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [/node_modules[\\\/]react/, /node_modules[\\\/]react-relay/],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('development'),
      },
      __DEBUG__: true,
    }),
  ],

};
