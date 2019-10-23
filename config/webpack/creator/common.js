const merge = require('webpack-merge');
// const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');

const paths = require('../../paths');
const commonConfig = require('../common');
const { IS_SERVING } = require('../config');

module.exports = merge(commonConfig, {
  entry: {
    app: ['react-hot-loader/patch', paths.entrypoint],
  },

  output: {
    path: paths.buildDir,
  },

  plugins: IS_SERVING
    ? []
    : [
        // new UnusedFilesWebpackPlugin({
        //   failOnUnused: IS_PRODUCTION,
        //   globOptions: {
        //     cwd: paths.sourceDir,
        //     ignore: [
        //       'assets/**/*',
        //       '**/__tests__/**/*',
        //       '**/__mock__/**/*',
        //       '**/__mocks__/**/*',
        //       'components/SRD/sass/**/*',
        //       'setupTests.js',
        //       // TODO: To be removed once SvgIcon component is being used in the app
        //       'components/SvgIcon/*',
        //       // TODO: To be removed once V2 components are being used
        //       'componentsV2/**/*',
        //       // TODO: To be removed once canvas component is being used
        //       'components/Canvas/**/*',
        //       'components/CanvasControls/**/*',
        //       'hocs/index.js',
        //       'hocs/styled.js',
        //       'hocs/withContext.jsx',
        //       'svgs/**/*',
        //     ],
        //   },
        // }),
      ],
});
