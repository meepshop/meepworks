import gulp from 'gulp';
import co from 'co';
import * as gb from 'greasebox';
import path from 'path';
import plumber from 'gulp-plumber';
import * as config from './config';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import {spawnServer, killServer} from './server';


const sourceDir = path.resolve(__dirname, `../${config.paths.source}`) + path.sep;
const serverSourceDir = path.resolve(__dirname, `../${config.paths.serverSource}`) + path.sep;
const sourceDirCheck = new RegExp('^' + escapeRegExp(sourceDir.replace('/', '\/')), 'i');
const serverSourceCheck = new RegExp('^' + escapeRegExp(serverSourceDir.replace('/', '\/')), 'i');
const jsCheck = /\.(js|jsx)$/i;
const stylusCheck = /\.styl$/i;
const jsonCheck = /\.json$/i;

function escapeRegExp(str) {
  return str.replace(/([.*+?^${}|\[\]\/\\])/g, "\\$1");
}

function isSource(p) {
  return sourceDirCheck.test(p) || serverSourceCheck.test(p);
}

function isJavascript(p) {
  return jsCheck.test(p);
}

function isStylus(p) {
  return stylusCheck.test(p);
}

function isJSON(p) {
  return jsonCheck.test(p);
}

gulp.task('watch', ['build', 'server-build'], () => {
  gulp.start('test');
  spawnServer();
  gulp.watch([ `${config.paths.source}/**`])
    .on('change', (change) => {
        if(isSource(change.path) &&
          (change.type === 'renamed' || change.type === 'added' || change.type === 'changed')) {
          if(isJavascript(change.path)) {
            console.log(`building: ${change.path}`);
            killServer();
            co(function * () {
              yield new Promise((resolve) => {
                gulp.src(change.path, {
                  base: sourceDir
                })
                .pipe(plumber({
                  errorHandler: (err) => {
                    console.log(err);
                    resolve();
                  }
                }))
                .pipe(sourcemaps.init())
                .pipe(babel(config.babelOptions))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(config.paths.build))
                .on('end', resolve);
              });
              gulp.start('test');
              spawnServer();
            });
          } else if(isJSON(change.path)) {
            //usually configs
            console.log(`copy: ${change.path}`);
            killServer();
            co(function * () {
              yield new Promise((resolve) => {
                gulp.src(change.path, {
                  base: sourceDir
                })
                .pipe(plumber({
                  errorHandler: (err) => {
                    console.log(err);
                    resolve();
                  }
                }))
                .pipe(gulp.dest(config.paths.build))
                .on('end', resolve);
              });
              gulp.start('test');
              spawnServer();
            });
          } else {
            console.log(`copy: ${change.path}`);
            killServer();
            co(function * () {
              yield new Promise((resolve) => {
                gulp.src(change.path, {
                  base: sourceDir
                })
                .pipe(plumber({
                  errorHandler: (err) => {
                    console.log(err);
                    resolve();
                  }
                }))
                .pipe(gulp.dest(config.paths.build))
                .on('end', resolve);
              });
              gulp.start('test');
              spawnServer();
            });
          }
        }
    })
    .on('error', console.log);
  gulp.watch([ `${config.paths.serverSource}/**`])
    .on('change', (change) => {
        if(isSource(change.path) &&
          (change.type === 'renamed' || change.type === 'added' || change.type === 'changed')) {
          if(isJavascript(change.path)) {
            console.log(`building: ${change.path}`);
            killServer();
            co(function * () {
              yield new Promise((resolve) => {
                gulp.src(change.path, {
                  base: serverSourceDir
                })
                .pipe(plumber({
                  errorHandler: (err) => {
                    console.log(err);
                    resolve();
                  }
                }))
                .pipe(sourcemaps.init())
                .pipe(babel(config.babelOptions))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(config.paths.serverBuild))
                .on('end', resolve);
              });
              gulp.start('test');
              spawnServer();
            });
          } else if(isJSON(change.path)) {
            //usually configs
            console.log(`copy: ${change.path}`);
            killServer();
            co(function * () {
              yield new Promise((resolve) => {
                gulp.src(change.path, {
                  base: serverSourceDir
                })
                .pipe(plumber({
                  errorHandler: (err) => {
                    console.log(err);
                    resolve();
                  }
                }))
                .pipe(gulp.dest(config.paths.serverBuild))
                .on('end', resolve);
              });
              gulp.start('test');
              spawnServer();
            });
          } else {
            console.log(`copy: ${change.path}`);
            killServer();
            co(function * () {
              yield new Promise((resolve) => {
                gulp.src(change.path, {
                  base: serverSourceDir
                })
                .pipe(plumber({
                  errorHandler: (err) => {
                    console.log(err);
                    resolve();
                  }
                }))
                .pipe(gulp.dest(config.paths.serverBuild))
                .on('end', resolve);
              });
              gulp.start('test');
              spawnServer();
            });
          }
        }
    })
    .on('error', console.log);
});
