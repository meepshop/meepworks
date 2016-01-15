import gulp from 'gulp';


export const babelOptions = {
  optional: ['runtime'],
  stage: 0
};

gulp.task('config', () => {
  console.log(JSON.stringify({
    babelOptions
  }, null, 2));
});


