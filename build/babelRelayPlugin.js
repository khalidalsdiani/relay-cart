var getBabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../data/schema.json');

// create a plugin instance
var plugin = getBabelRelayPlugin(schema.data);

module.exports = getBabelRelayPlugin(schema.data);
