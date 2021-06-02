import HTMLPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import safePostCSSParser from 'postcss-safe-parser';
import PreloadPlugin from 'preload-webpack-plugin';
import InlineChunkHTMLPlugin from 'react-dev-utils/InlineChunkHtmlPlugin';
import TerserPlugin from 'terser-webpack-plugin';

import paths from '../../paths';

export default {
  output: {
    filename: `${paths.staticJS}[name].[contenthash].js`,
    chunkFilename: `${paths.staticJS}[name].[contenthash].chunk.js`,
  },

  stats: 'minimal',

  devtool: 'nosources-source-map',

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 2017,
          },
          compress: {
            ecma: 5,
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
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCSSParser,
          map: { inline: false, annotation: true },
        },
      }),
    ],

    splitChunks: {
      chunks: 'all',
    },
  },

  plugins: [
    new PreloadPlugin({
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.(woff|woff2|otf|ttf|eot)$/.test(entry)) return 'font';
        return 'script';
      },
      rel: 'preload',
      include: 'initial',
      exclude: 'runtime',
      fileBlacklist: [/\.map$/, /runtime/],
    }),
    new InlineChunkHTMLPlugin(HTMLPlugin, [/runtime/]),
    new MiniCSSExtractPlugin({
      filename: `${paths.staticCSS}[name].[contenthash].css`,
      chunkFilename: `${paths.staticCSS}[name].[contenthash].chunk.css`,
    }),
  ],
};
