import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/', (ctx) => {
  ctx.body = {status: 'ok'}
})

export default function addRouter(app) {
  return app
    .use(router.routes())
    .use(router.allowedMethods())
}