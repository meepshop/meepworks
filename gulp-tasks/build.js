import gulp from 'gulp';
import co from 'co';
import path from 'path';
import plumber from 'gulp-plumber';
import * as config from './config';

import * as gb from 'greasebox';


gulp.task('build', ['clean:dist'], (cb) => {
  gulp.src('source/**/*.js')
  .pipe(plumber({
    errorHandler: cb
  }))
  .pipe(gb.loadMap())
  .pipe(gb.babelTransform({
    optional: ['runtime']
  }))
  .pipe(gb.writeMap())
  .pipe(gulp.dest('dist'))
  .on('end', cb);
});

gulp.task('clean:dist', (cb) => {
  gb.rm(path.resolve(__dirname, '../dist'))
    .then(cb)
    .catch(cb);
});
