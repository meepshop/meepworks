var gulp = require('gulp');
var watch = require('gulp-watch');
var cp = require('child_process');
var path = require('path');
var fs = require('fs');

/**
 * Only load gulp-tasks with --harmony flag on
 */
if(process.execArgv.indexOf('--harmony')>-1) {
  fs.readdirSync('gulp-tasks').forEach(function(task) {
    if(/^[A-za-z].*\.js$/i.test(task)) {
      require(path.resolve(__dirname, 'gulp-tasks', task));
    }
  });
}
gulp.task('init', function () {
  gulp.start('test-server-init');
  gulp.start('source-watch');
});

gulp.task('clean', function () {
  spawnTask('dist-clean');
});
gulp.task('build', function () {
  spawnTask('dist-build');
});

gulp.task('watch', function () {
  spawnTask('source-watch');
});

/**
 *  default task monitors gulpfile.js, gulp-tasks, and bin/tools.js and reload on file change
 */
gulp.task('default', function () {
  var p;
  function reload () {
    if(p) {
      p.kill('SIGHUP');
    }
    p = spawnTask('init');
  }
  watch(['gulpfile.js', 'gulp-tasks/**.js', 'bin/tools.js'], reload).on('error', function (err) {
    console.log(err);
    this.emit('end');
  });
  reload();
});

/**
 *  @function
 *    @param task {string} - name of the task to run
 *  spawns child node process with harmony flag on to run tasks
 */
function spawnTask(task) {
  return cp.spawn('node', ['--harmony', 'node_modules/gulp/bin/gulp.js', task], {
      stdio: 'inherit'
    });
}


