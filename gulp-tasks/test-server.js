var gulp = require('gulp');
var path = require('path');
var co = require('co');
var cofs = require('co-fs');
var exec = require('co-exec');
var cp = require('child_process');
var watch = require('gulp-watch');
var rename = require('gulp-rename');


var server_process;


gulp.task('test-server-init', ['dist-build'], function() {
  gulp.start('test-server-start');
});

gulp.task('test-server-clean', function(cb) {
  co(function * () {
    yield tools.cleanPath(testBuildPath);
    yield tools.cleanPath(testNodeBuildPath);
    cb();
  })();
});
gulp.task('test-server-start', function() {
  spawnServer();
});

gulp.task('test-server-stop', function() {
  killServer();
});

gulp.task('test-server-restart', function() {
  killServer();
  spawnServer();
});


process.on('exit', killServer);

process.on('SIGHUP', function() {
  killServer();
  process.exit();
});

function killServer() {
  if (server_process) {
    console.log('stopping server');
    server_process.kill();
    server_process = null;
  }
}

function spawnServer() {
  console.log('starting server');
  server_process = cp.spawn('node', ['--harmony', path.resolve('build-node/test/server.js')], {
    stdio: 'inherit'
  });
}

function handleError() {
  console.log(error);
  this.emit('end');
}
