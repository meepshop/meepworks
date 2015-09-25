import gulp from 'gulp';
import path from 'path';
import plumber from 'gulp-plumber';
import * as config from './config';

import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import rm from 'greasebox/rm';


gulp.task('build', ['clean:build'], () => {
  return gulp.src('source/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel(config.babelOptions))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('build'));
});


gulp.task('clean:build', () => {
  return rm(path.resolve(__dirname, '../build'));
});
