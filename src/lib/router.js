import koaRouter from 'koa-router'
import passport from 'koa-passport'

import Users from '../controllers/users'

const router = koaRouter()

export default class Router {
  constructor (deps) {
    this.users = deps(Users)

    router.get('/', (ctx) => {
      ctx.body = {status: 'ok'}
    })

    router.get('/users', this.users.getResource)

    router.get('/protected', passport.authenticate('basic', { session: false }), (ctx) => {
      ctx.body = {status: 'ok'}
    })
  }

  attach (app) {
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}