import gulp from 'gulp';
import co from 'co';
import path from 'path';
import plumber from 'gulp-plumber';
import * as config from './config';

import * as gb from 'greasebox';


gulp.task('build', ['clean:node'], (cb) => {
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

gulp.task('build:client', ['clean:client'], (cb) => {
  gulp.src('source/**/*.js')
  .pipe(plumber({
    errorHandler: cb
  }))
  .pipe(gb.loadMap())
  .pipe(gb.babelTransform({
    modules: 'system'
  }))
  .pipe(gb.writeMap())
  .pipe(gulp.dest('client'))
  .on('end', cb);
});

gulp.task('clean:node', ['test'], (cb) => {
  gb.rm(path.resolve(__dirname, '../dist'))
    .then(cb)
    .catch(cb);
});
gulp.task('clean:client', ['test'], (cb) => {
  gb.rm(path.resolve(__dirname, '../client'))
    .then(cb)
    .catch(cb);
});
