import paths from '../../paths';

export default {
  output: {
    filename: `${paths.staticJS}[name].js`,
    chunkFilename: `${paths.staticJS}[name].chunk.js`,
  },

  devtool: 'eval-source-map',
};
