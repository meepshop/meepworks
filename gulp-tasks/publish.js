import gulp from 'gulp';
import fs from 'fs-promise';
import cp from 'child_process';
import semver from 'semver';
import chalk from 'chalk';
import path from 'path';

gulp.task('publish', ['build'], async () => {
  let latest = '0.0.0';
  try {
    let info = JSON.parse(cp.execSync('npm view --json meepworks'));
    info.versions.sort(sortSemver);
    latest = info.versions.pop();
    console.log(`Latest version found on npm: ${chalk.red(latest)}`);
  } catch(err) {}

  let manifest = JSON.parse(await fs.readFile(path.resolve(__dirname, '../package.json')));
  if(semver.gt(manifest.version, latest)) {
    delete manifest.jspm.directories;
    manifest.jspm.registry = "jspm";
    await fs.writeFile(path.resolve(__dirname, '../build/package.json'), JSON.stringify(manifest, null, 2));
    console.log(cp.execSync('npm publish', {
      cwd: path.resolve(__dirname, '../build')
    }).toString('utf8'));
  } else {
    console.log(`Trying to publish version: ${chalk.green( manifest.version )}, but latest npm version is ${chalk.green( latest )}.`);
  }
});

function sortSemver(a, b) {
  if(semver.gt(a, b)) {
    return 1;
  } else if(semver.lt(a, b)) {
    return -1;
  }
  return 0;
}
