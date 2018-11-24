/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * This function is exported by analytics.js, and executed when
 * the trigger topic receives a message.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
const elasticsearch = require("elasticsearch");

exports.publishToElasticsearch = async (pubsubMessage, context) => {
    if (pubsubMessage.data) {
        var message = Buffer.from(pubsubMessage.data, 'base64').toString();

        console.info("[TELEMETRY]", message);

        var client = new elasticsearch.Client({
            hosts: ["35.205.16.214:9200"]
        });

        console.info(await client.index({
            index: 'telemetry',
            type: "_doc",
            body: JSON.parse(message)
        }));
    }
};