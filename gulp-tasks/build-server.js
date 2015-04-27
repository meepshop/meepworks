import gulp from 'gulp';
import * as gb from 'greasebox';
import path from 'path';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import * as config from './config';

gulp.task('build-server', ['build-server-js', 'copy-server-files'], () => {});

gulp.task('copy-server-files', ['clean-server'], (cb) => {
  gulp.src([ 'test-server/source/**', '!test-server/**/*.js' ])
  .pipe(gulp.dest(config.paths.server))
  .on('end', cb);
});


gulp.task('build-server-js', ['clean-server'], (cb) => {
  gulp.src('test-server/source/**/*.js')
  .pipe(plumber({
    errorHandler: cb
  }))
  .pipe(sourcemaps.init())
  .pipe(babel({
    modules: 'common',
    optional: ['runtime']
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(config.paths.server))
  .on('end', cb);
});


gulp.task('clean-server',  (cb) => {
  gb.rm(path.resolve(__dirname, '../test-server/node'))
    .then(cb);
});
