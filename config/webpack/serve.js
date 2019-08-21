const merge = require('webpack-merge');
const buildConfig = require('./build');
const serveConfig = require('./serveCommon');

module.exports = merge(buildConfig, serveConfig());
