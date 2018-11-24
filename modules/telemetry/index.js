const {getTelemetrySubscription} = require.main.require('../modules/pubsub')
const elasticsearch = require.main.require('../modules/elk/elastic-client')

getTelemetrySubscription().on('message', async function(message) {
    console.log(message)

    var client = elasticsearch.getClient();

    var a = await client.index({
        index: 'telemetry',
        type: "_doc",
        body: JSON.parse(Buffer.from(message.data).toString())
    });
});
