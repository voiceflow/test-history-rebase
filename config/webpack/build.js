const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const InlineManifestPlugin = require('inline-manifest-webpack-plugin');
const Md5HashPlugin = require('webpack-md5-hash');
const merge = require('webpack-merge');
const path = require('path');
const commonConfig = require('./common');
const paths = require('../paths');
const { BASE_HREF, IS_PRODUCTION, IS_SERVING, USE_SOURCEMAPS } = require('./config');

module.exports = merge(commonConfig, {
  output: {
    filename: `${paths.staticJS}${IS_PRODUCTION ? '[name].[hash:8]' : 'bundle'}.js`,
    chunkFilename: `${paths.staticJS}[name]${IS_PRODUCTION ? '.[chunkhash:8]' : ''}.chunk.js`,
  },

  devtool: USE_SOURCEMAPS && (IS_PRODUCTION ? 'nosources-source-map' : 'cheap-eval-source-map'),

  optimization: {
    minimize: IS_PRODUCTION,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },

        parallel: true,
        cache: true,
        sourceMap: USE_SOURCEMAPS,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: { inline: false, annotation: true },
        },
      }),
    ],

    splitChunks: {
      chunks: 'all',
      name: false,
      minChunks: 2
    },

    runtimeChunk: {
      name: 'runtime'
    },
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.indexHTML,
    }),
    new InlineManifestPlugin(),
    new BaseHrefWebpackPlugin({ baseHref: BASE_HREF }),
    ...(IS_SERVING ? [] : [new CopyPlugin([{ from: paths.publicDir, to: paths.buildDir }])]),
    ...(IS_PRODUCTION
      ? [
          new Md5HashPlugin(),
          new MiniCssExtractPlugin({
            filename: `${paths.staticCSS}[name].[contenthash:8].css`,
            chunkFilename: `${paths.staticCSS}[name].[contenthash:8].chunk.css`,
          }),
          new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim: true,
            exclude: [/\.map$/],
            importWorkboxFrom: 'cdn',
            navigateFallback: `${BASE_HREF}index.html`,
            navigateFallbackBlacklist: [
              // Exclude URLs starting with /_, as they're likely an API call
              new RegExp('^/_'),
              // Exclude URLs containing a dot, as they're likely a resource in
              // public/ and not a SPA route
              new RegExp('/[^/]+\\.[^/]+$'),
            ],
          }),
        ]
      : []),
  ],

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
                  sourceMap: USE_SOURCEMAPS,
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
                  sourceMap: USE_SOURCEMAPS,
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
});
