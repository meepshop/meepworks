import gulp from 'gulp';
import path from 'path';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';
import through from 'through2';

import BabelInstrumenter from 'greasebox/babel-instrumenter';

gulp.task('test', (cb) => {
  gulp.src(['source/**/*.js'])
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: BabelInstrumenter
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
