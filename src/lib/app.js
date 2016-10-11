'use strict'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import cors from 'koa-cors'
import passport from 'koa-passport'
import addRouter from './router'

import config from '../services/config'

// Configure passport
import '../services/auth'

export default class App {
  constructor () {
    this.config = config

    let app = new Koa()

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

    app = addRouter(app)

    app.listen(this.config.get('port'))
  }
}
