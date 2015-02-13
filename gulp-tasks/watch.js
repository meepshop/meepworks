import gulp from 'gulp';
gulp.task('watch', ['test'], () => {
  gulp.watch(['source/*.js', 'test/*.js'], ['test'])
  .on('error', console.log);
});
