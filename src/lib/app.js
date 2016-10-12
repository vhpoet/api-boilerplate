'use strict'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import cors from 'koa-cors'
import passport from 'koa-passport'
import attachRouter from './router'

import Config from '../lib/config'

// Configure passport
import '../lib/auth'

export default class App {
  constructor (deps) {
    this.config = deps(Config)
  }

  async start () {
    const app = this.app = new Koa()

    app.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        ctx.body = { message: err.message }
        ctx.status = err.status || 500
      }
    })

    app.use(bodyParser())
    app.use(compress())
    app.use(cors())
    app.use(passport.initialize())

    attachRouter(app)

    app.listen(this.config.data.get('port'))
  }
}
