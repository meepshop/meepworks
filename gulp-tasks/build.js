var gulp = require('gulp');
var path = require('path');
var through = require('through2');
var rename = require('gulp-rename');
var co = require('co');
var cofs = require('co-fs');
var exec = require('co-exec');
var tools = require('../bin/tools.js');
var watch = require('gulp-watch');
var fs = require('fs');

var sourcePath = 'source';
var destPath = 'build';

gulp.task('dist-clean', function(cb) {
  co(function * () {
    yield tools.cleanPath(destPath);
    cb();
  })();

});


gulp.task('dist-build', ['dist-clean'], function(cb) {
  co(function * () {
    try {
    yield tools.buildFile(sourcePath, {
      glob: true,
      destPath: destPath,
      sourcePath: sourcePath
    });
    } catch(err) {
      console.log(err);
    }
    cb();
  })();
});

gulp.task('source-watch', function() {
  gulp.watch(['source/**'])
    .on('error', function(err) {
      console.log(err);
    })
    .on('change', function(change) {
      co(function * () {
        if (change.path.indexOf(path.resolve(sourcePath)) > -1) {
          if (change.type === 'rename') {
            console.log(change.old + ' was renamed to ' + change.path);
          } else {
            console.log(change.path + ' was ' + change.type);
          }
          gulp.start('test-server-stop');
          var relativePath = path.relative(sourcePath, change.path);
          switch (change.type) {
            case 'deleted':
              yield tools.cleanPath(destPath, relativePath);
              break;
            default:
              try {
                yield tools.buildFile(change.path, {
                  glob: (yield cofs.stat(change.path)).isDirectory(),
                  destPath: destPath,
                  sourcePath: sourcePath
                });
              } catch (err) {
                return console.log(err);
              }
              gulp.start('test-server-start');
              break;

          }
        }
      })();
    });

});
