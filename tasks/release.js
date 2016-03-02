/**
 * Created by Soon on 10/18/2015.
 */
import path from 'path';
import gulp from 'gulp';
import gutil from 'gulp-util';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import del from 'del';
import webpack from 'webpack';

import { webpackProductionConfig } from '../webpack.production.config';

const rootPath = path.resolve('.');
const distPath = path.join(rootPath, 'dist');
const productionDistPath = path.join(distPath, 'production');
const publicPath = path.join(rootPath, 'public');

gulp.task('production:clean', (callback)=> {
  del([`${productionDistPath}/**`]).then(()=> {
    callback();
  });
});

gulp.task('production:dist', [], (callback)=> {
  const productionCompiler = webpack(webpackProductionConfig);

  // run webpack
  productionCompiler.run((err, stats)=> {
    if (err) throw new gutil.PluginError('production:dist', err);
    gutil.log('production:dist', stats.toString({
      colors: true,
    }));

    const statsJson = stats.toJson();

    gulp
      .src(path.join(publicPath, 'index.template.html'))
      .pipe(replace('main.js', statsJson.assetsByChunkName.app[0]))
      .pipe(replace('main.css', statsJson.assetsByChunkName.app[1]))
      .pipe(replace('vendor.js', statsJson.assetsByChunkName.vendor))
      .pipe(rename('index.html'))
      .pipe(gulp.dest(productionDistPath))
      .on('end', ()=> {
        gutil.log('dist!');
        callback();
      });
  });
});
