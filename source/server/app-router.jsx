import Koa from 'koa';
import Router from 'koa-router';
import Serve from 'koa-static';
import Mount from 'koa-mount';
import HtmlPage from '../views/html-page/html-page';
import React from 'react';





function AppRouter(options) {
  var app = Koa();
  app.use(Router(app));


  options.pages.forEach(function(page) {
    app.get(page.url, function * () {

      
      
      this.type = 'text/html; charset: utf-8;';
      this.status = 200;
      var scripts = options.scripts.map(function (src) {
        return <script src={src}></script>;
      });

      scripts.push();

      
      this.body = '<!DOCTYPE html>' + React.renderToStaticMarkup(<HtmlPage scripts={scripts} />);
      
    });
    
  });
  return app;

}

export default AppRouter;
