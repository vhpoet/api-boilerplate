import koaRouter from 'koa-router'
import passport from 'koa-passport'

const router = koaRouter()

router.get('/', (ctx) => {
  ctx.body = {status: 'ok'}
})

router.get('/protected', passport.authenticate('basic', { session: false }), (ctx) => {
  ctx.body = {status: 'ok'}
})

export default function attachRouter(app) {
  app.use(router.routes())
  app.use(router.allowedMethods())

  return app
}