var elasticsearch = require('elasticsearch');

var _client;

module.exports.create = function(hosts, logLevel) {
    _client = new elasticsearch.Client({
        hosts: Array.isArray(hosts) ? hosts : [hosts],
        log: logLevel || 'trace'
    });
};

module.exports.getClient = function() {
    return _client
};
