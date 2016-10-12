import bunyan from 'bunyan'
import logger from 'koa-bunyan-logger'

import Config from './config'

export default class Log {
  constructor(deps) {
    this.config = deps(Config)
    this.defaultLogger = bunyan.createLogger({
      name: 'api',
      level: this.config.data.get('logLevel'),
      stream: process.stdout
    })
  }

  create(module) {
    return this.defaultLogger.child({
      module: module
    })
  }

  static attach(ctx, app) {
    const isTrace = ctx.log.trace()

    app.use(logger(ctx.log))
    app.use(logger.requestIdContext())
    app.use(logger.requestLogger({
      updateRequestLogFields: function (fields) {
        return {
          headers: ctx.headers,
          body: isTrace ? ctx.body : undefined,
          query: ctx.query
        }
      },
      updateResponseLogFields: function (fields) {
        return {
          duration: fields.duration,
          status: ctx.status,
          headers: ctx.headers,
          body: isTrace ? ctx.body : undefined
        }
      }
    }))
  }
}