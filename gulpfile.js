var gulp = require('gulp');
var watch = require('gulp-watch');
var cp = require('child_process');
var path = require('path');
var fs = require('fs');

gulp.task('load-tasks', function () {
  fs.readdirSync('gulp-tasks').forEach(function(task) {
    if(/^[A-za-z].*\.js$/i.test(task)) {
      require(path.resolve(__dirname, 'gulp-tasks', task));
    }
  });
});
gulp.task('init', ['load-tasks'], function () {
  gulp.run('test-server');
});

gulp.task('default', function () {
  var p;
  function reload () {
    if(p) {
      p.kill('SIGHUP');
    }
    p = cp.spawn('node', ['--harmony', 'node_modules/gulp/bin/gulp.js', 'init'], {
      stdio: 'inherit'
    });
  }
  watch(['gulpfile.js', 'gulp-tasks/**.js'], reload).on('error', function (err) {
    console.log(err);
    this.emit('end');
  });
  reload();
});
