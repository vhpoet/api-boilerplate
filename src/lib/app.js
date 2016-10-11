'use strict'

import Koa from 'koa'
import compress from 'koa-compress'
import cors from 'koa-cors'
import addRouter from './router'

let app = new Koa()

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.body = { message: err.message }
    ctx.status = err.status || 500
  }
})

app = addRouter(app)

app
  .use(compress())
  .use(cors())
  .listen(3100)

export default app