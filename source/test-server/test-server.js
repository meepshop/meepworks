import koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import router from 'koa-router';
import path from 'path';
import React from 'react';
import fs from 'fs';

import HtmlPage from '../views/html-page/html-page.js'; 


var app = new koa();

app.use(function *(next) {
  console.log(this.req.url);
  yield next;
});
app.use(mount('/jspm_packages', serve(path.resolve(__dirname, '../../jspm_packages'))));
app.use(mount('/config', serve(path.resolve(__dirname, '../../config'))));
app.use(mount('/build', serve(path.resolve(__dirname, '../../build'))));

app.use(router(app));


app.get(/.*/, function *(next) {
  var app = this.req.url.substr(1) || 'index';
  var doctype = '<!DOCTYPE html>';
  this.type = 'text/html, charset=utf-8';
  this.body = doctype + React.renderToStaticMarkup(React.createFactory(HtmlPage)({
    title: 'Meepworks Test Page',
    scripts: [
      React.DOM.script({
      src: 'jspm_packages/traceur-runtime.js'
    }),
      React.DOM.script({
      src: 'jspm_packages/system.js'
    }),
			React.DOM.script({
			src: 'config/jspm.js'
			}),
      React.DOM.script({
        dangerouslySetInnerHTML: {
          __html: "System.import('build/test-apps/" + app + "/app');"
        }
      })

    ]
  }));
});

app.listen(13320, function () {
  console.log('listening on 13320');
});


