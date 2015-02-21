import gulp from 'gulp';
import co from 'co';
import path from 'path';

import * as gb from 'greasebox';

gulp.task('build', (cb) => {
  co(function * () {
    yield gb.rm(path.resolve(__dirname, '../dist'));
    yield new Promise((resolve, reject) => {
      gulp.src('source/**/*.js')
      .on('error', reject)
      .pipe(gb.loadMap())
      .on('error', reject)
      .pipe(gb.babelTransform({
        blacklist: ['regenerator']
      }))
      .on('error', reject)
      .pipe(gb.writeMap())
      .on('error', reject)
      .pipe(gulp.dest('dist'))
      .on('error', reject)
      .on('finish', resolve);
    });

  }).then(cb)
    .catch(cb);
});
