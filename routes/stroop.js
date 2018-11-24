const router = require('koa-router')()

router.get('/stroop', async (ctx, next) => {
  console.log(4)
await ctx.render('stroop', {
  title: 'Stroop test'
})
})

module.exports = router
