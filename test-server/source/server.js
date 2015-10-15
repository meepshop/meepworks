import Koa from 'koa';
import serve from 'koa-static-cache';
import mount from 'koa-mount';
import favicon from 'koa-favicon';
import path from 'path';


import RequireFilter from '../../build/require-filter';

import Router from '../../build/server-router';


const checkMeepworks = /^meepworks\//;
  const meepworksPath = path.resolve(__dirname, '../../build') + '/';

const requireFilter = new RequireFilter({
  root: path.resolve(__dirname, '../../')
  //baseURL: '',
  //version: Date.now
});
requireFilter.filter(/^meepworks\/.*/, (target, originalRequire) => {
  target = target.replace(/^meepworks/, path.resolve(__dirname, '../../build'));
  return originalRequire(target);

});
requireFilter.filter('.css!');

const server = new Koa();

server.use(favicon());

function * capture(next) {
  this.status = 404;
}

server.use(mount('/jspm_packages', serve(path.resolve(__dirname, '../../jspm_packages'), {
})));
server.use(mount('/jspm_packages', capture));
server.use(mount('/build', serve(path.resolve(__dirname, '../../build'), {
})));
server.use(mount('/build', capture));
server.use(mount('/test-server/build', serve(__dirname, {
})));
server.use(mount('/test-server/build', capture));

server.use(function * (next) {
  console.log('req start: ', this.req.url);
  console.time('req');
  this.initialData = {test: 'test-data'};
  yield next;
  console.timeEnd('req');

});

const app = new Router({
  appPath: path.resolve(__dirname, './app/app'),
  //publicPath points to the public source folder that contains code for client side
  publicPath: __dirname,
  //publicUrl is the url path where the public folder is mounted
  publicUrl: 'test-server/build',

  jspmConfig: 'jspm_packages/config.js',
  //dirname: __dirname,
  root: path.resolve(__dirname, '../../'),
  //buildPath: 'test-server/build',
  //fileURL: 'test-server/build/server',
  //version
});

app.on('error', (err) => {
  console.log(err);
  console.log(err.stack);
});

server.use(app.routes);

server.listen(18881);
console.log('listening to 18881...');
