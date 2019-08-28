const merge = require('webpack-merge');
const build = require('./build');
const paths = require('../paths');

module.exports = merge.strategy({
  'entry.app': 'replace',
})(build, {
  entry: {
    app: ['react-hot-loader/patch', paths.adminpoint],
  },
});
