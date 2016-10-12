'use strict'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import cors from 'koa-cors'
import passport from 'koa-passport'

import Config from './config'
import Log from './log'
import Router from './router'

// Configure passport
import '../lib/auth'

export default class App {
  constructor (deps) {
    this.config = deps(Config)
    this.logger = deps(Log)
    this.log = this.logger.create('app')
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

    Log.attach(this, app)
    Router.attach(app)

    app.listen(this.config.data.get('port'))

    this.log.info('listening on port ' + this.config.data.get('port'))
  }
}
