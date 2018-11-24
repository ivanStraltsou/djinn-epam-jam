const router = require('koa-router')()
const elasticsearch = require.main.require('../modules/elk/elastic-client')

router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!'
    })
})

router.post('/iot', async (ctx, next) => {
    var client = elasticsearch.getClient();

    var a = await client.index({
        index: 'telemetry',
        id: '1',
        type: "_doc",
        body: {
            "co2": 450,
            "temperature": 23
        }
    });

    console.log(a)
})

router.get('/json', async (ctx, next) => {
    ctx.body = {
        title: 'koa2 json'
    }
})

module.exports = router
