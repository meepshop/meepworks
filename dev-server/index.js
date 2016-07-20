// TODO koa server here

import path from 'path'

import mount from 'koa-mount'
import serve from 'koa-static'
import Koa from 'koa'

const app = new Koa()

app.use(mount('/build', serve(path.resolve(__dirname, '../build/'))))

app.use(ctx => {
  ctx.body = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title></title>
      </head>
      <body>
        <div id='app'></div>
        <script src='/build/bundle.js'></script>
      </body>
    </html>`
})

app.listen(18882)
