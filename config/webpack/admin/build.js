const merge = require('webpack-merge');

const commonConfig = require('./common');
const commonBuildConfig = require('../common/build');

module.exports = merge(commonConfig, commonBuildConfig);
