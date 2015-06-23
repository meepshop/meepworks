import gulp from 'gulp';
import cofs from 'greasebox/cofs';
import path from 'path';
import co from 'co';
import exec from 'co-exec';
import semver from 'semver';
import chalk from 'chalk';

gulp.task('publish', ['build'], (cb) => {
  co(function * () {
    let latest = '0.0.0';
    try {
      let info = JSON.parse(yield exec('npm view --json meepworks'));
      info.versions.sort(sortSemver);
      latest = info.versions.pop();
      console.log(`latest version on npm: ${latest}`);
    } catch(err) {}

    let manifest = JSON.parse(yield cofs.readFile(path.resolve(__dirname, '../package.json')));
    if(semver.gt(manifest.version, latest)) {
      delete manifest.jspm.directories;
      manifest.jspm.registry = "jspm";
      yield cofs.writeFile(path.resolve(__dirname, '../build/package.json'), JSON.stringify(manifest, null, 2));
      console.log( yield exec('npm publish', {
        cwd: path.resolve(__dirname, '../build')
      }));
    } else {
      console.log(`Trying to publish version: ${chalk.green( manifest.version )}, but latest npm version is ${chalk.green( latest )}.`);
    }

  }).then(cb)
    .catch(cb);
});

function sortSemver(a, b) {
  if(semver.gt(a, b)) {
    return 1;
  } else if(semver.lt(a, b)) {
    return -1;
  }
  return 0;
}
