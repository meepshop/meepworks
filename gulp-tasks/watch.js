import gulp from 'gulp';
import {killServer} from './test-server';

gulp.task('watch', ['build', 'test-server'], () => {
  gulp.watch('source/**/*.js', ['test-server'])
  .on('error', console.log);
  gulp.watch('test/*.js', ['test'])
  .on('error', console.log);
  gulp.watch('test-server/source/**/*', ['test-server'])
  .on('error', console.log);
});
