const {PubSub} = require('@google-cloud/pubsub');
const TelemetryTopic = require.main.require('../conf/dev.json').cloud.pubsub.topic.telemetry.id;

// Creates a client
const pubsub = new PubSub();

const getTelemetrySubscription = () => {
    return pubsub.subscription(TelemetryTopic)
};

module.exports.getTelemetrySubscription = getTelemetrySubscription;
