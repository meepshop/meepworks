import gulp from 'gulp';
import path from 'path';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';
import through from 'through2';

import To5Instrumenter from 'greasebox/to5-instrumenter';

gulp.task('test', (cb) => {
  gulp.src(['source/**/*.js'])
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: To5Instrumenter
    }))
    .pipe(istanbul.hookRequire())
    .on('error', cb)
    .on('finish', () => {
      gulp.src(['test/*.js'])
      .pipe(mocha({
        globals: ['meepworkDebug']
      }))
      .on('error', cb)
      .pipe(istanbul.writeReports())
      .on('error', cb)
      .on('end', cb);
    });
});
