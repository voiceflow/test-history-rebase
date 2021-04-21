import { CleanWebpackPlugin as CleanPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HTMLPlugin from 'html-webpack-plugin';
import merge from 'webpack-merge';
import { instrument, strict, typecheck } from 'webpack-nano/argv';

import paths from '../../paths';
import { BASE_HREF, ENV, IS_ADMIN, IS_PRODUCTION, IS_SERVING } from '../config';
import { assetLoader, babelLoader, fileLoader, staticSVGLoader, styleLoader, svgLoader, typecheckPlugin } from './fragments';

export default merge(
  {
    plugins: [
      ...((typecheck || strict) && !instrument ? [typecheckPlugin] : []),
      new HTMLPlugin({
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
        }),
        templateParameters: {
          ...ENV,
          base: BASE_HREF,
        },
      }),

      ...(IS_SERVING
        ? []
        : [
            new CleanPlugin(),
            new CopyPlugin({
              patterns: [
                {
                  from: paths.publicDir,
                  to: IS_ADMIN ? paths.admin.buildDir : paths.buildDir,
                  globOptions: {
                    dot: false,
                  },
                },
              ],
            }),
          ]),
    ],

    module: {
      strictExportPresence: true,

      rules: [
        {
          oneOf: [
            {
              ...babelLoader,
              include: paths.sourceDir,
            },
            assetLoader,
            staticSVGLoader,
            svgLoader(),
            styleLoader,
            fileLoader,
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
