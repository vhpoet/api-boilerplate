'use strict'

import Koa from 'koa'

const app = new Koa()

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.body = { message: err.message }
    ctx.status = err.status || 500
  }
})

app.use(async ctx => {
  ctx.body = {status: 'ok'}
})

app.listen(3100)

export default app