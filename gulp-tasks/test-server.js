import gulp from 'gulp';
import cp from 'child_process';
import path from 'path';

gulp.task('test-server', ['build-server'], function () {
  require(path.resolve(__dirname, '../server-build/server'));
});
