const merge = require('webpack-merge');
const adminBuildConfig = require('./adminBuild');
const serveConfig = require('./serveCommon');
const paths = require('../paths');

module.exports = merge(adminBuildConfig, serveConfig(3001, paths.adminBuildDir));
