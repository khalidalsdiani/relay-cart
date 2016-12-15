/**
 * Created by Xin on 15/12/2016.
 */
module.exports = {
  module: {
    loaders: [
      {
        test: '\/.css',
        loaders: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader?sourceMap=inline'
        ]
      }
    ]
  }
};
