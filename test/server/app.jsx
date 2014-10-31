import koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import router from 'koa-router';
import path from 'path';
import React from 'react';
import fs from 'fs';
import favicon from 'koa-favicon';

import Meepworks from '../../dist-node/index';

import IndexApp from '../apps/index/app';

var app = new koa();

app.use(function *(next) {
  console.log(this.req.url);
  yield next;
});
app.use(mount('/jspm_packages', serve(path.resolve(__dirname, '../../jspm_packages'))));
app.use(mount('/config', serve(path.resolve(__dirname, '../../config'))));
app.use(mount('/dist', serve(path.resolve(__dirname, '../../dist'))));
app.use(mount('/test-build/apps', serve(path.resolve(__dirname, '../apps'))));
app.use(favicon());

app.use(router(app));
app.get(/.*/, function *(next) {
  var app = this.req.url.substr(1) || 'index';
  var doctype = '<!DOCTYPE html>';
  this.type = 'text/html, charset=utf-8';
  /*jshint ignore:start */
  this.body = doctype + React.renderToStaticMarkup(
    <Meepworks.Views.HtmlPage title="Meepworks Test Page" 
  scripts={[
    //<script src="jspm_packages/traceur-runtime.js" key="traceur-runtime"></script>,
    <script src="jspm_packages/system.js" key="system"></script>,
    <script src="config/jspm.js" key="jspm"></script>,
    <script key="bootloader" dangerouslySetInnerHTML={{
      __html: ["System.import('test-build/apps/" + app + "/app')",
        ".then(function(app){app.default.init();})",
        ".catch(function(err){console.log(err);})"
      ].join('')
    }}></script>
  ]} setInnerHTML={React.renderToString(<IndexApp/>)} />);
  /* jshint ignore:end */
});

app.listen(13320, function () {
  console.log('listening on 13320');
});


