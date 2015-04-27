import gulp from 'gulp';

export const paths = {
  server: 'test-server/build',
  source: 'source',
  dist: 'dist',
  serverSource: 'test-server/source'
};

gulp.task('config', () => {
  console.log(JSON.stringify({
    paths
  }, null, 2));
});


