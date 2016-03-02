/**
 * Created by Soon on 10/18/2015.
 */
import path from 'path';
import autoprefixer from 'autoprefixer';

import webpack from 'webpack';
import StatsPlugin from 'stats-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const rootPath = path.join(__dirname);
const outputPath = path.join(rootPath, 'dist', 'production', 'public');

const jsPath = path.join(rootPath, 'js');

const stylePaths = [
  path.join(jsPath, 'components', 'styles'),
  path.join(rootPath, 'node_modules', 'normalize.css'),
  path.join(rootPath, 'node_modules', 'ionicons', 'scss'),
];

const fontPaths = [
  path.join(rootPath, 'node_modules', 'ionicons', 'fonts'),
];

export const webpackProductionConfig = {
  entry: {
    app: './js/app.js',
    vendor: ['classnames', 'immutable', 'react', 'react-dom', 'react-router'],
  },

  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: outputPath,
    publicPath: '/public/',
  },

  // recordsOutputPath: path.join(__dirname, 'records.json'),

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          plugins: ['./build/babelRelayPlugin'],
          presets: ['es2015', 'react', 'stage-0'],
          cacheDirectory: true,
        },
        include: jsPath,
      },
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract(
          'css!postcss!sass'
        ),
        include: stylePaths,
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        include: fontPaths,
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        include: fontPaths,
      },
      { test: /\.png$/, loader: 'file-loader' },
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
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('production'),
      },
      __CLIENT__: true,
      __SERVER__: false,
      __DEBUG__: false,
    }),
    new ExtractTextPlugin('[name].[chunkhash].css', { allChunks: true }),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'[name].[chunkhash].js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      output: {
        comments: false,
      },
      compressor: {
        warnings: false,
      },
    }),
    new StatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [/node_modules[\\\/]/],
    }),
  ],
};
