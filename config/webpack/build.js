const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const commonConfig = require('./common');
const paths = require('../paths');
const { IS_PRODUCTION } = require('./config');

module.exports = merge(commonConfig, {
  plugins: [],

  module: {
    strictExportPresence: true,

    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            include: paths.sourceDir,
            loader: 'babel-loader',
            options: {
              customize: require.resolve('babel-preset-react-app/webpack-overrides'),

               plugins: [
                [
                  'babel-plugin-named-asset-import',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                      },
                    },
                  },
                ],
              ],
              cacheDirectory: true,
              cacheCompression: IS_PRODUCTION,
              compact: IS_PRODUCTION,
            },
          },
          {
            test: /\.css$/,
            use: [
              IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  sourceMap: IS_PRODUCTION,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    // eslint-disable-next-line global-require
                    require('postcss-flexbugs-fixes'),
                    // eslint-disable-next-line global-require
                    require('postcss-preset-env')({
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    }),
                  ],
                  sourceMap: IS_PRODUCTION,
                },
              },
            ],
            sideEffects: true,
          },
          {
            loader: 'file-loader',
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: `${paths.staticMedia}[name].[hash:8].[ext]`,
            },
          },
        ]
      }
    ]
  }
});