import BaseError from './base-error'

export default class ServerError extends BaseError {
  * handler (ctx, log) {
    log.warn('Server error: ' + this.message)
    ctx.status = 500
    ctx.body = {
      id: this.name,
      message: this.message
    }
  }
}