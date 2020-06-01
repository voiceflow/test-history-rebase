const { port } = require('webpack-nano/argv');
const merge = require('webpack-merge');

const buildConfig = require('./build');
const serveConfig = require('../common/serve');

module.exports = merge(buildConfig, serveConfig(port || 3000));
