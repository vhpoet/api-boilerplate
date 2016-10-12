export default (opts) => {
  const log = opts.log

  return async function handleError (ctx, next) {
    try {
      await next()
    } catch (err) {
      if (typeof err.handler === 'function') {
        await err.handler(ctx, log)
      } else {
        log.error(err)
      }
    }
  }
}