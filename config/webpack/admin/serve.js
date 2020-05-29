const { port } = require('webpack-nano/argv');
const merge = require('webpack-merge');

const paths = require('../../paths');
const serveConfig = require('../common/serve');
const buildConfig = require('./build');

module.exports = merge(buildConfig, serveConfig(port || 3001, paths.admin.buildDir));
