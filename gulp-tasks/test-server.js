var gulp = require('gulp');
var path = require('path');
var co = require('co');
var cofs = require('co-fs');
var exec = require('co-exec');
var cp = require('child_process');
var watch = require('gulp-watch');
var rename = require('gulp-rename');

var tools = require('../bin/tools.js');

var server_process;
var testAppBuildPath = path.resolve(__dirname, '../build/test-apps');

gulp.task('test-server-restart', ['test-server-build'], function (){
  killServer();
  spawnServer();
});

gulp.task('test-server-init', ['views-build-node', 'test-server-build', 'test-server-app-build'], function () {
  spawnServer();
});
gulp.task('test-server-reload', ['views-build-node'], function () {
  killServer();
  spawnServer();
});


gulp.task('test-server-build',  function () {
  gulp.src(path.resolve(__dirname, '../source/test-server/*.js'))
    .pipe(tools.nodify())
    .pipe(gulp.dest(path.resolve(__dirname, '../build-node/test-server')));
});

gulp.task('test-server-app-clean', function (cb) {
  co(function *() {
    if(yield cofs.exists(testAppBuildPath)) {
      yield exec('rm -R ' + testAppBuildPath);
    } 
    cb();
  })();
});

gulp.task('test-server-app-build', ['test-server-app-clean'], function (cb) {
  gulp.src(path.resolve(__dirname, '../source/test-apps/**/*.jsx'))
    .pipe(tools.jsxTransform())
    .pipe(rename(function (filePath) {
      filePath.extname = '.js';
    }))
    .pipe(gulp.dest(testAppBuildPath))
    .on('end', cb);
});




gulp.task('test-server', function () {
  gulp.start('test-server-init');
  watch([
    path.resolve(__dirname, '../source/test-server/*.js') 
  ], function () {
    gulp.start('test-server-restart');
  }).on('error', handleError);
  watch([path.resolve(__dirname, '../source/views/html-page/html-page.jsx')], function () {
    gulp.start('test-server-reload'); 
  }).on('error', handleError);
});



process.on('exit', killServer);

process.on('SIGHUP', function () {
  killServer();
  process.exit();
});
function killServer() {
  if(server_process) {
    server_process.kill();
  }
}

function spawnServer() {
  server_process = cp.spawn('node', ['--harmony', path.resolve(__dirname, '../build-node/test-server/test-server.js')], {
    stdio: 'inherit'
  });
}

function handleError() {
    console.log(error);
    this.emit('end');
  }
