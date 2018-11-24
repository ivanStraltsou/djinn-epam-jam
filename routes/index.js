const router = require('koa-router')()
const elasticsearch = require.main.require('../modules/elk/elastic-client')

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

router.get('/analytics-data', async (ctx, next) => {
    var client = elasticsearch.getClient();

    var a = await client.search({
            index: 'telemetry',
            type: '_doc',
            body: {
                query: {
                        range: {
                            timestamp: {
                                gte: "now-10m"
                            }
                        }
                    }
                },
                size: 10000
        });

    ctx.body = a
})

router.get('/analytics', async (ctx, next) => {
    await ctx.render('analytics', {
        title: 'Analytics'
    })
})


router.get('/map', async (ctx, next) => {
    await ctx.render('office-map');
})

module.exports = router
