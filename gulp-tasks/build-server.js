import gulp from 'gulp';
import * as gb from 'greasebox';
import path from 'path';
import plumber from 'gulp-plumber';

gulp.task('build-server', ['clean-server'], (cb) => {
  gulp.src('test-server/**/*.js')
  .pipe(plumber({
    errorHandler: cb
  }))
  .pipe(gb.loadMap())
  .pipe(gb.babelTransform({
    modules: 'system'
  }))
  .pipe(gb.writeMap())
  .pipe(gulp.dest('test-server-build'))
  .on('end', cb);
});


gulp.task('clean-server', (cb) => {
  gb.rm(path.resolve(__dirname, '../test-server-build'))
    .then(cb);
});
