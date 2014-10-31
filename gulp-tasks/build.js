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
var sourcePathAbs = path.resolve(__dirname, '../source');

var distPath = 'dist';
var distNodePath = 'dist-node';
var distEs5Path = 'dist-es5';

gulp.task('dist-clean', function(cb) {
  co(function * () {
    yield tools.cleanPath(distPath);
    yield tools.cleanPath(distNodePath);
    //yield tools.cleanPath(distEs5Path);
    cb();
  })();

});


gulp.task('dist-build', ['dist-clean'], function(cb) {
  co(function * () {
    yield tools.buildFile(sourcePathAbs, {
      glob: true,
      destPath: distPath,
      destNodePath: distNodePath,
      sourceDir: sourcePathAbs
    });
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
        if (change.path.indexOf(sourcePathAbs) > -1) {
          if (change.type === 'rename') {
            console.log(change.old + ' was renamed to ' + change.path);
          } else {
            console.log(change.path + ' was ' + change.type);
          }
          gulp.start('test-server-stop');
          var relativePath = path.relative(sourcePathAbs, change.path);
          var distPathAbs = path.resolve(distPath, relativePath);
          var distNodePathAbs = path.resolve(distNodePath, relativePath);
          switch (change.type) {
            case 'deleted':
              yield tools.cleanPath(distPathAbs);
              yield tools.cleanPath(distNodePathAbs);
              break;
            default:
              try {
                yield tools.buildFile(change.path, {
                  glob: (yield cofs.stat(change.path)).isDirectory(),
                  destPath: distPath,
                  destNodePath: distNodePath,
                  sourceDir: sourcePathAbs
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
