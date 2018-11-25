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

    var telemetry = await client.search({
            index: 'telemetry',
            type: '_doc',
            body: {
                query: {
                        range: {
                            timestamp: {
                                gte: 'now-1h'
                            }
                        }
                    },
                sort : [
                    { timestamp : {order : 'asc'}}
                ],
                size: 10000
            }

        });

    var productivity = await client.search({
        index: 'cognitive-test-auto',
        type: '_doc',
        body: {
            query: {
                range: {
                    timestamp: {
                        gte: "now-1h"
                    }
                }
            },
            sort : [
                { timestamp : {order : 'asc'}}
            ],
            size: 10000
        }
    });

    ctx.body = {
        telemetry: telemetry,
        productivity: productivity
    }
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
