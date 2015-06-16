import gulp from 'gulp';
import co from 'co';
import path from 'path';
import plumber from 'gulp-plumber';
import * as config from './config';

import * as gb from 'greasebox';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';


gulp.task('server-build', ['server-copy', 'clean:server-build'], (cb) => {
  gulp.src('test-server/source/**/*.js')
  .pipe(plumber({
    errorHandler: cb
  }))
  .pipe(sourcemaps.init())
  .pipe(babel(config.babelOptions))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('test-server/build'))
  .on('end', cb);
});

gulp.task('server-copy', ['clean:server-build'], () => {
  return gulp.src('test-server/source/**/*.json')
    .pipe(gulp.dest('test-server/build'));
});

gulp.task('clean:server-build', (cb) => {
  gb.rm(path.resolve(__dirname, '../test-server/build'))
    .then(cb)
    .catch(cb);
});
