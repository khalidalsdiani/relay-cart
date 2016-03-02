/**
 * Created by Soon on 10/18/2015.
 */
import path from 'path';
import { exec } from 'child_process';
import gulp from 'gulp';
import gutil from 'gulp-util';

const rootPath = path.join(__dirname, '..');

gulp.task('dev:schema-generate', ()=> {
  exec(`babel-node ${rootPath}/scripts/updateSchema.js`);
});

// recompile the schema whenever .js files in data are updated
gulp.task('dev:schema-watch', () => {
  const watcher = gulp.watch([
    path.join(rootPath, 'data', '**/*.js'),
    /*    path.join(__dirname, 'src', 'types', '**!/!*.js'),
     path.join(__dirname, 'src', 'mutations', '**!/!*.js'),*/
  ], ['dev:schema-generate']);
  watcher.on('change', (event)=> {
    gutil.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});
