import gulp from 'gulp';
import {killServer} from './test-server';
import debug from 'debug';
debug.enable('watch-log');
const log = debug('watch-log');

gulp.task('watch', ['build', 'test-server'], () => {
  gulp.watch('source/**/*.js', ['test', 'test-server'])
  .on('error', log);
  gulp.watch('test/*.js', ['test'])
  .on('error', log);
  gulp.watch('test-server/source/**/*.js', ['test-server'])
  .on('error', log);
});
