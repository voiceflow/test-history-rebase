import { BaseHrefWebpackPlugin } from 'base-href-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import merge from 'webpack-merge';
import { instrument } from 'webpack-nano/argv';

import paths from '../../paths';
import { BASE_HREF, ENV, IS_ADMIN, IS_PRODUCTION, IS_SERVING } from '../config';
import { babelLoader, fileLoader, styleLoader, svgLoader, typecheckPlugin } from './fragments';

export default merge(
  {
    plugins: [
      new CleanWebpackPlugin() as any,
      ...(instrument ? [] : [typecheckPlugin]),
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
        templateParameters: (compilation) => {
          return {
            compilation,
            ...ENV,
          };
        },
      }),
      new BaseHrefWebpackPlugin({ baseHref: BASE_HREF }),

      ...(IS_SERVING ? [] : [new CopyPlugin({ patterns: [{ from: paths.publicDir, to: IS_ADMIN ? paths.admin.buildDir : paths.buildDir }] })]),
    ],

    module: {
      strictExportPresence: true,

      rules: [
        { parser: { requireEnsure: false } },
        {
          oneOf: [{ ...babelLoader, include: paths.sourceDir }, svgLoader, styleLoader, fileLoader],
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
