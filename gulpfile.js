var path = require('path');
var fs = require('fs');
var to5 = require('6to5');
var gulp = require('gulp');
var cp = require('child_process');
var chalk = require('chalk');

if(process.execArgv.indexOf('--harmony') > -1 || process.execPath.match(/iojs/)) {
  to5.register();
  fs.readdirSync('gulp-tasks').forEach(function(task) {
    if(/^[A-za-z].*\.js$/i.test(task)) {
      require(path.resolve(__dirname, 'gulp-tasks', task));
    }
  });

} else {
  fs.readdirSync('gulp-tasks').forEach(function (task) {
    if(/^[A-Za-z].*\.js$/i.test(task)) {
      gulp.task(path.basename(task, '.js'), delegate);
    }
  });
}

function delegate(cb) {
  var handler = handleProcessExit.bind(this, cb);
  console.log(chalk.red('delegate task to harmony runner'));
  cp.spawn('node', ['--harmony', 'node_modules/gulp/bin/gulp', process.argv[2]], {
    stdio: 'inherit'
  }).on('exit', handler)
    .on('error', handler);
}
function handleProcessExit(cb, err) {
  console.log(chalk.red('delegate task completed'));
  cb(err);
}
