module.exports = {
  output: {
    filename: 'js/bundle.js',
    chunkFilename: 'js/[name].chunk.js',
    pathinfo: true,
  },

  devtool: 'eval-source-map',

  performance: {
    hints: false
  }
};