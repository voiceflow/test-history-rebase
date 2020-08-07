import { BaseHrefWebpackPlugin } from 'base-href-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import merge from 'webpack-merge';
import { instrument } from 'webpack-nano/argv';

import paths from '../../paths';
import { BASE_HREF, IS_ADMIN, IS_PRODUCTION, IS_SERVING } from '../config';

export default merge(
  {
    plugins: [
      new CleanWebpackPlugin() as any,
      ...(instrument
        ? []
        : [
            new ForkTSCheckerWebpackPlugin({
              tsconfig: path.resolve(__dirname, '../../../tsconfig.build.json'),
              checkSyntacticErrors: true,
              compilerOptions: { skipLibCheck: true },
            }),
          ]),
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
        }),
      }),
      new BaseHrefWebpackPlugin({ baseHref: BASE_HREF }),

      ...(IS_SERVING ? [] : [new CopyPlugin({ patterns: [{ from: paths.publicDir, to: IS_ADMIN ? paths.admin.buildDir : paths.buildDir }] })]),
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
        // {
        //   rules: instrument
        //     ? [
        //         {
        //           test: /\.[jt]sx?$/,
        //           include: paths.sourceDir,
        //           loader: 'istanbul-instrumenter-loader',
        //           enforce: 'post',
        //           options: {
        //             esModules: true,
        //           },
        //         },
        //       ]
        //     : [],
        // },
      ],
    },
  },
  // eslint-disable-next-line import/no-dynamic-require, global-require
  require(IS_PRODUCTION ? './prod' : './dev').default
);
