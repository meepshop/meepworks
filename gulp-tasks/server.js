import gulp from 'gulp';
import cp from 'child_process';
import path from 'path';

let _p;


export function spawnServer() {
  if(_p) {
    _p.kill();
  }
  _p = cp.spawn('node', ['test-server/build/server'], {
    stdio: 'inherit'
  });
}

export function killServer() {
  if(_p) {
    _p.kill();
  }
}
gulp.task('server', ['build-server'], () => {
  spawnServer();
});

process.on('exit', killServer);
