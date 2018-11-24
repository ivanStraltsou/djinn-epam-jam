const {PubSub} = require('@google-cloud/pubsub');

// Creates a client
const pubsub = new PubSub();

const saveTelemetry = async function(req, res) {
    const timestamp = Date.now()
    let message = req.body; // || req.body.message || 'Hello World!';

    console.info("[TELEMETRY]", message);

    const dataBuffer = Buffer.from(JSON.stringify(message));

    const messageId = await pubsub
        .topic('telemetry')
        .publisher()
        .publish(dataBuffer);

    console.log(`Message ${messageId} published.`);

    res.json({
        timestamp: timestamp,
        success: true
    });
}

exports.telemetry = function(req, res) {
    switch(req.method) {
        case "POST":
            saveTelemetry(req, res);
            break;
            defaults:
                req.status(405).send("Method not allowed")
            console.error(req.method, "is not supported", req.body)
    }
};
