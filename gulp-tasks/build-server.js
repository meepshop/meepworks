import gulp from 'gulp';
import * as gb from 'greasebox';
import path from 'path';
import plumber from 'gulp-plumber';

gulp.task('build-server', ['build-server-node', 'copy-server-files'], () => {});

gulp.task('copy-server-files', ['clean-server-node'], (cb) => {
  gulp.src([ 'test-server/source/**', '!test-server/**/*.js' ])
  .pipe(gulp.dest('test-server/node'))
  .on('end', cb);
});


gulp.task('build-server-node', ['clean-server-node'], (cb) => {
  gulp.src('test-server/source/**/*.js')
  .pipe(plumber({
    errorHandler: cb
  }))
  .pipe(gb.loadMap())
  .pipe(gb.babelTransform({
    optional: ['runtime']
  }))
  .pipe(gb.writeMap())
  .pipe(gulp.dest('test-server/node'))
  .on('end', cb);
});


gulp.task('clean-server-client',  (cb) => {
  gb.rm(path.resolve(__dirname, '../test-server/client'))
    .then(cb);
});
gulp.task('clean-server-node',  (cb) => {
  gb.rm(path.resolve(__dirname, '../test-server/node'))
    .then(cb);
});
