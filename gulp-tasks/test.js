import gulp from 'gulp';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';
import BabelInstrumenter from 'greasebox/babel-instrumenter';
import path from 'path';

let isTesting = false;

gulp.task('test', (cb) => {
  function logError(err) {
    console.log(err);
    cb();
  }
  gulp.src(['source/*.js'])
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: BabelInstrumenter,
      sourceDir: path.resolve(__dirname, '../source'),
      buildDir: path.resolve(__dirname, '../build')
    }))
    .on('error', logError)
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src(['test/*.js'])
      .pipe(mocha())
      .on('error', logError)
      .pipe(istanbul.writeReports())
      .on('end', cb)
      .on('error', logError);
    })
    .on('error', logError);
});

gulp.task('test-watch', ['watch'], () => {
  gulp.start('test');
  gulp.watch(['test/**'])
  .on('change', change => {
      gulp.start('test');
    })
  .on('errer', console.log);
});


