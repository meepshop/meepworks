import gulp from 'gulp';
import * as gb from 'greasebox';
import path from 'path';
import plumber from 'gulp-plumber';

gulp.task('build-server', ['clean-server', 'build-client'], (cb) => {
  gulp.src('test-server/**/*.js')
  .pipe(plumber({
    errorHandler: cb
  }))
  .pipe(gb.loadMap())
  .pipe(gb.babelTransform({
  }))
  .pipe(gb.writeMap())
  .pipe(gulp.dest('server-build'))
  .on('end', cb);
});


gulp.task('build-client', ['clean-client'], (cb) => {
  gulp.src('test-server/**/*.js')
  .pipe(plumber({
    errorHandler: cb
  }))
  .pipe(gb.loadMap())
  .pipe(gb.babelTransform({
    modules: 'system'
  }))
  .pipe(gb.writeMap())
  .pipe(gulp.dest('server-client'))
  .on('end', cb);
});

gulp.task('clean-client', (cb) => {
  gb.rm(path.resolve(__dirname, '../server-client'))
    .then(cb);
});
gulp.task('clean-server', (cb) => {
  gb.rm(path.resolve(__dirname, '../server-build'))
    .then(cb);
});
