var gulp = require('gulp');
var path = require('path');
var through = require('through2');
var rename = require('gulp-rename');
var co = require('co');
var cofs = require('co-fs');
var exec = require('co-exec');
var tools = require('../bin/tools.js');

var buildPath = path.resolve(__dirname, '../build/views');
var nodeBuildPath = path.resolve(__dirname, '../bin/views');
gulp.task('views-clean', function (cb) {
  co(function * () {
    if(yield cofs.exists(buildPath)) {
      yield exec('rm -R ' + buildPath);
    }
    if(yield cofs.exists(nodeBuildPath)) {
      yield exec('rm -R ' + nodeBuildPath);
    }
    cb();
  })();

});

gulp.task('views-build', ['views-clean'], function (cb) {
  gulp.src([path.resolve(__dirname, '../source/views/**/*.jsx')]) //path.resolve(__dirname, '../source/views/**/*.jsx')
    .pipe(tools.jsxTransform())
    .pipe(rename(function (filePath) {
      filePath.extname = '.js';
    }))
    .pipe(gulp.dest(path.resolve(__dirname, '../build/views/')))
    .on('end', cb);
});
gulp.task('views-build-node', ['views-build'], function (cb) {
  gulp.src([path.resolve(__dirname, '../build/views/**/*.js')])
    .pipe(tools.nodify())
    .pipe(gulp.dest(path.resolve(__dirname, '../build-node/views/')))
    .on('end', cb);
});

