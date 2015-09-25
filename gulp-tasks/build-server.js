import gulp from 'gulp';
import path from 'path';
import { babelOptions } from './config';

import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import rm from 'greasebox/rm';

gulp.task('build-server', ['build', 'clean-server', 'copy-server'], () => {
  gulp.src('test-server/source/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel(babelOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('test-server/build'));
});

gulp.task('copy-server', ['clean-server'], () => {
  return gulp.src(['test-server/source/**/*', '!test-server/source/**/*.js'])
  .pipe(gulp.dest('test-server/build'));
});

gulp.task('clean-server', () => {
  return rm(path.resolve(__dirname, '../test-server/build'));
});
