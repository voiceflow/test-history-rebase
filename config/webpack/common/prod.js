const InlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const paths = require('../../paths');

module.exports = {
  output: {
    filename: `${paths.staticJS}[name].[hash:8].js`,
    chunkFilename: `${paths.staticJS}[name].[chunkhash:8].chunk.js`,
  },

  stats: 'minimal',

  devtool: 'nosources-source-map',

  optimization: {
    minimize: true,
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
        sourceMap: true,
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
      minChunks: 2,
    },

    runtimeChunk: true,
  },

  plugins: [
    new PreloadWebpackPlugin({
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.(woff|woff2|otf|ttf|eot)$/.test(entry)) return 'font';
        return 'script';
      },
      rel: 'preload',
      include: 'initial',
      exclude: 'runtime',
      fileBlacklist: [/\.map$/, /runtime.*.js/],
    }),
    new InlineSourcePlugin(),
    new MiniCssExtractPlugin({
      filename: `${paths.staticCSS}[name].[contenthash:8].css`,
      chunkFilename: `${paths.staticCSS}[name].[contenthash:8].chunk.css`,
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
  ],
};