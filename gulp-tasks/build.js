import gulp from 'gulp';
import co from 'co';
import path from 'path';
import plumber from 'gulp-plumber';
import * as config from './config';

import * as gb from 'greasebox';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';


gulp.task('build', ['clean:dist'], (cb) => {
  gulp.src('source/**/*.js')
  .pipe(plumber({
    errorHandler: cb
  }))
  .pipe(sourcemaps.init())
  .pipe(babel({
    modules: 'common',
    optional: ['runtime']
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist'))
  .on('end', cb);
});

gulp.task('clean:dist', (cb) => {
  gb.rm(path.resolve(__dirname, '../dist'))
    .then(cb)
    .catch(cb);
});
