import gulp from 'gulp';
import path from 'path';
import plumber from 'gulp-plumber';
import { babelOptions } from './config';

import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import { spawnServer, killServer } from './server';
import escapeRegExp from 'greasebox/escape-reg-exp';

const sourceDir = path.resolve(__dirname, '../source') + path.sep;
const serverSourceDir = path.resolve(__dirname, '../test-server/source') + path.sep;

const sourceDirCheck = new RegExp('^' + escapeRegExp(sourceDir.replace('/', '\/')), 'i');
const serverSourceCheck = new RegExp('^' + escapeRegExp(serverSourceDir.replace('/', '\/')), 'i');
const jsCheck = /\.(js|jsx)$/i;

const jsonCheck = /\.json$/i;

function isSource(p) {
  return sourceDirCheck.test(p);
}

function isServerSource(p) {
  return serverSourceCheck.test(p);
}

function isJSON(p) {
  return jsonCheck.test(p);
}

function isJavascript(p) {
  return jsCheck.test(p);
}

gulp.task('watch', ['server'], () => {
  gulp.watch(['source/**', 'test-server/source/**'])
  .on('change', processChange);

});

function processChange(change) {
  if(change.type === 'renamed' || change.type === 'added' || change.type === 'changed') {
    let base, dest;
    if(isSource(change.path)) {
      base = sourceDir;
      dest = 'build';
    } else if(isServerSource(change.path)) {
      base = serverSourceDir;
      dest = 'test-server/build';
    } else {
      return;
    }
    if(isJavascript(change.path)) {
      processJavascript(change, base, dest);
    } else {
      processGeneric(change, base, dest);
    }
  }
}

async function processJavascript(change, base, dest) {
  console.log(`building ${change.path}...`);
  await new Promise(resolve => {
    gulp.src(change.path, {
      base
    }).pipe(plumber({
      errorHandler: err => {
        console.log(err);
        resolve();
      }
    })).pipe(sourcemaps.init())
      .pipe(babel(babelOptions))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dest))
      .on('end', resolve);
  });
  console.log('build complete');
  spawnServer();
}
async function processGeneric(change, base, dest) {
  console.log(`copying ${change.path}...`);
  await new Promise(resolve => {
    gulp.src(change.path, {
      base
    }).pipe(plumber({
      errorHandler: err => {
        console.log(err);
        resolve();
      }
    }))
      .pipe(gulp.dest(dest))
      .on('end', resolve);
  });
  console.log('copy complete');
  if(isJSON(change.path)) {
    spawnServer();
  }
}
