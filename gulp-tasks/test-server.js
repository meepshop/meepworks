var gulp = require('gulp');
var path = require('path');
var cp = require('child_process');
var watch = require('gulp-watch');

var server_process;


gulp.task('test-server', function () {
  function reload () {
    kill();
    server_process = cp.spawn('node', ['--harmony', path.resolve(__dirname, '../test-server/test-server.js')], {
      stdio: 'inherit'
    });
  }
  watch([path.resolve(__dirname, '../test-server/**/*.js'), path.resolve(__dirname, '../test-server/test-server.js')], reload).on('error', function () {
    console.log(error);
    this.emit('end');
  });
  reload();
});



process.on('exit', kill);

process.on('SIGHUP', kill);
function kill() {
  console.log('test');
  if(server_process) {
    console.log('killing');
    server_process.kill();
  }
}
