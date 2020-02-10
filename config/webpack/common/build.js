const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const ForkTSCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const paths = require('../../paths');
const { BASE_HREF, IS_ADMIN, IS_PRODUCTION, IS_SERVING } = require('../config');

module.exports = merge(
  {
    plugins: [
      new CleanWebpackPlugin(),
      new ForkTSCheckerWebpackPlugin({ checkSyntacticErrors: true, compilerOptions: { skipLibCheck: true } }),
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.indexHTML,
        ...(IS_PRODUCTION && {
          minify: {
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
            removeComments: true,
            useShortDoctype: true,
            keepClosingSlash: true,
            collapseWhitespace: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeStyleLinkTypeAttributes: true,
          },
          inlineSource: 'runtime~.+\\.js',
        })
      }),
      new BaseHrefWebpackPlugin({ baseHref: BASE_HREF }),

      ...(IS_SERVING ? [] : [new CopyPlugin([{ from: paths.publicDir, to: IS_ADMIN ? paths.adminBuildDir : paths.buildDir }])]),
    ],

    module: {
      strictExportPresence: true,

      rules: [
        { parser: { requireEnsure: false } },
        {
          oneOf: [
            {
              test: /\.[jt]sx?$/,
              include: paths.sourceDir,
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: IS_PRODUCTION,
                compact: IS_PRODUCTION,
              },
            },
            {
              test: /\.svg$/,
              include: path.resolve(paths.sourceDir, 'svgs'),
              use: ({ resource }) => ({
                loader: '@svgr/webpack',
                options: {
                  svgoConfig: {
                    plugins: [
                      {
                        cleanupIDs: {
                          prefix: `ID-${resource}`,
                        },
                      },
                    ],
                  },
                },
              }),
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
          ],
        },
      ],
    },
  }, 
  require(IS_PRODUCTION ? './prod' : './dev')
);