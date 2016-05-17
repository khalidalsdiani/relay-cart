/**
 * Created by Soon on 10/18/2015.
 */
import path from 'path';
import autoprefixer from 'autoprefixer';

import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const rootPath = path.join(__dirname);
const outputPath = path.join(rootPath, 'dist', 'production', 'public');

const jsPath = path.join(rootPath, 'js');

const stylePaths = [
  path.join(jsPath, 'components', 'styles'),
  path.join(rootPath, 'node_modules', 'normalize.css'),
  path.join(rootPath, 'node_modules', 'ionicons', 'dist', 'scss'),
];

const fontPaths = [
  path.join(rootPath, 'node_modules', 'ionicons', 'dist', 'fonts'),
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

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract(
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
        NODE_ENV: JSON.stringify('production'),
      },
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
  ],
};
