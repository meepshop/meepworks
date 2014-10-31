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

var testServerSource = 'test/server';
var testAppsSource = 'test/apps';
var testServerSourceAbs = path.resolve('test/server');
var testAppsSourceAbs= path.resolve('test/apps');

var testAppBuildPath = path.resolve(__dirname, '../build/test-apps');


gulp.task('test-server-build', function (cb) {
  gulp.src('test/server/*')
    .pipe(tools.nodify())
    .pipe(gulp.dest('test-build/server'))
    .on('end', cb);
});

gulp.task('test-apps-build', function (cb) {
  gulp.src('test/apps/**')
    .pipe(tools.jsxTransform())
    .pipe(rename(function (filename){
      if(filename.extname.toLowerCase()==='.jsx') {
        filename.extname = '.js';
      }
    }))
    .pipe(gulp.dest('test-build/apps'))
    .on('end', cb);
});

gulp.task('test-server-start', ['dist-build', 'test-server-build', 'test-apps-build'], function () {
  spawnServer();
});

gulp.task('test-server-clean', function (cb) {
  co(function *(){
    yield tools.cleanPath('test-build');
    cb();
  })();
});


gulp.task('test-server-restart', function (){
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
        if (change.path.indexOf(testServerSourceAbs) > -1) {
          if (change.type === 'rename') {
            console.log(change.old + ' was renamed to ' + change.path);
          } else {
            console.log(change.path + ' was ' + change.type);
          }
          relativePath = path.relative(testServerSourceAbs, change.path);
          switch (change.type) {
            case 'deleted':
              yield tools.cleanPath(path.resolve('test-build/server', relativePath));
              break;
              default:
                yield tools.buildFile(change.path, {
                glob: (yield cofs.stat(change.path)).isDirectory(),
                destNodePath: 'test-build/server',
                sourceDir: testServerSourceAbs
              });
            gulp.start('test-server-restart');
            break;
              
          }

        } else if (change.path.indexOf(testAppsSourceAbs) > -1) {
          if (change.type === 'rename') {
            console.log(change.old + ' was renamed to ' + change.path);
          } else {
            console.log(change.path + ' was ' + change.type);
          }
          relativePath = path.relative(testAppsSourceAbs, change.path);
          switch (change.type) {
            case 'deleted':
              yield tools.cleanPath(path.resolve('test-build/apps', relativePath));
              break;
              default:
                yield tools.buildFile(change.path, {
                glob: (yield cofs.stat(change.path)).isDirectory(),
                destNodePath: 'test-build/Apps',
                sourceDir: testAppsSourceAbs
              });
            break;
              
          }
        }
      })();
    });
});

//
//gulp.task('test-server-init', ['views-build-node', 'test-server-build', 'test-server-app-build'], function () {
//  spawnServer();
//});
//gulp.task('test-server-reload', ['views-build-node'], function () {
//  killServer();
//  spawnServer();
//});
//
//
//gulp.task('test-server-build',  function () {
//  gulp.src(path.resolve(__dirname, '../source/test-server/*.js'))
//    .pipe(tools.nodify())
//    .pipe(gulp.dest(path.resolve(__dirname, '../build-node/test-server')));
//});
//
//gulp.task('test-server-app-clean', function (cb) {
//  co(function *() {
//    if(yield cofs.exists(testAppBuildPath)) {
//      yield exec('rm -R ' + testAppBuildPath);
//    } 
//    cb();
//  })();
//});
//
//gulp.task('test-server-app-build', ['test-server-app-clean'], function (cb) {
//  gulp.src(path.resolve(__dirname, '../source/test-apps/**/*.jsx'))
//    .pipe(tools.jsxTransform())
//    .pipe(rename(function (filePath) {
//      filePath.extname = '.js';
//    }))
//    .pipe(gulp.dest(testAppBuildPath))
//    .on('end', cb);
//});
//
//
//
//
//gulp.task('test-server', function () {
//  gulp.start('test-server-init');
//  watch([
//    path.resolve(__dirname, '../source/test-server/*.js') 
//  ], function () {
//    gulp.start('test-server-restart');
//  }).on('error', handleError);
//  watch([path.resolve(__dirname, '../source/views/html-page/html-page.jsx')], function () {
//    gulp.start('test-server-reload'); 
//  }).on('error', handleError);
//});



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
  server_process = cp.spawn('node', ['--harmony', path.resolve(__dirname, '../test-build/server/app.js')], {
    stdio: 'inherit'
  });
}

function handleError() {
  console.log(error);
  this.emit('end');
}
