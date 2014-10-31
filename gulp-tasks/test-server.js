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

var testSource = 'test';
var testSourceAbs = path.resolve('test');

var testBuildPath = 'test-build';
var testNodeBuildPath = 'test-node-build';



gulp.task('test-server-build', ['test-server-clean'], function(cb) {
  co(function * () {
    yield tools.buildFile(testSource, {
      glob: true,
      destPath: 'test-build',
      destNodePath: 'test-node-build',
      sourceDir: testSourceAbs
    });
    cb();
  })();
});


gulp.task('test-server-init', ['dist-build', 'test-server-build'], function() {
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

gulp.task('test-server-watch', function() {
  gulp.watch('test/**')
    .on('error', function(err) {
      console.log(err);
    })
    .on('change', function(change) {
      co(function * () {
        var relativePath;
        if (change.path.indexOf(testSourceAbs + '/') > -1) {
          if (change.type === 'rename') {
            console.log(change.old + ' was renamed to ' + change.path);
          } else {
            console.log(change.path + ' was ' + change.type);
          }
          killServer();
          relativePath = path.relative(testSourceAbs, change.path);
          switch (change.type) {
            case 'deleted':
              yield tools.cleanPath(path.resolve(testBuildPath, relativePath));
              yield tools.cleanPath(path.resolve(testNodeBuildPath, relativePath));
              break;
              default:
                try {
              yield tools.buildFile(change.path, {
                glob: (yield cofs.stat(change.path)).isDirectory(),
                destPath: testBuildPath,
                destNodePath: testNodeBuildPath,
                sourceDir: testSourceAbs
              });
              } catch(err) {
                return console.log(err);
              }
              spawnServer();
              break;

          }
        }
      })();
    });
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
  server_process = cp.spawn('node', ['--harmony', path.resolve(__dirname, '../test-node-build/server/app.js')], {
    stdio: 'inherit'
  });
}

function handleError() {
  console.log(error);
  this.emit('end');
}
