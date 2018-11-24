const router = require('koa-router')()
const elasticsearch = require.main.require('../modules/elk/elastic-client')

router.get('/question', async (ctx, next) => {
  console.log(4)
  await ctx.render('question', {
    title: 'Questionnaire'
  })
})

router.post('/results', async (ctx, next) => {
  
  var client = elasticsearch.getClient();

  console.log(ctx.requst)
  var a = await client.index({
    index: 'cognitive-test',
    type: "_doc",
    body: ctx.request.body
  });
});

module.exports = router
