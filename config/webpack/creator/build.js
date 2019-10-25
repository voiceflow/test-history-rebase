const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const merge = require('webpack-merge');

const { IS_SERVING } = require('../config');

const commonConfig = require('./common');
const commonBuildConfig = require('../common/build');

module.exports = merge(commonConfig, commonBuildConfig, {
  plugins: IS_SERVING ? [] : [new BundleAnalyzerPlugin({ analyzerMode: 'static' })],
});
