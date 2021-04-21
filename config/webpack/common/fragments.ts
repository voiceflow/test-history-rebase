import { TransformOptions } from '@babel/core';
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';

import paths from '../../paths';
import { IS_PRODUCTION } from '../config';

export const typecheckPlugin = new ForkTSCheckerPlugin({
  typescript: {
    configFile: path.resolve(__dirname, '../../../tsconfig.build.json'),
    mode: 'write-references',
  },
});

export const tsConfigPathsPlugin = new TSConfigPathsPlugin({
  configFile: path.resolve(__dirname, '../../../tsconfig.build.json'),
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
});

export const babelLoader: webpack.RuleSetRule = {
  test: /\.[jt]sx?$/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    cacheCompression: IS_PRODUCTION,
  },
};

export const typescriptLoader: webpack.RuleSetRule = {
  test: /\.[jt]sx?$/,
  loader: 'ts-loader',
  options: {
    transpileOnly: true,
    compilerOptions: {
      target: 'es5',
    },
  },
};

export const staticSVGLoader: webpack.RuleSetRule = {
  test: /assets\/.*\.svg$/,
  type: 'asset/inline',
};

export const assetLoader: webpack.RuleSetRule = {
  test: /assets\/.*\.(png|csv)$/,
  type: 'asset/resource',
};

export const svgLoader = (options?: TransformOptions): webpack.RuleSetRule => ({
  test: /\.svg$/,
  include: path.resolve(paths.sourceDir, 'svgs'),
  use: ({ resource }) => [
    {
      loader: 'babel-loader',
      options: {
        ...options,
        sourceMaps: false,
      },
    },
    {
      loader: '@svgr/webpack',
      options: {
        babel: false,
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
    },
  ],
});

export const styleLoader: webpack.RuleSetRule = {
  test: /\.css$/,
  use: [
    IS_PRODUCTION ? MiniCSSExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        url: false,
        importLoaders: 1,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          ident: 'postcss',
          plugins: [
            'postcss-flexbugs-fixes',
            [
              'postcss-preset-env',
              {
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              },
            ],
          ],
        },
      },
    },
  ],
  sideEffects: true,
};

export const fileLoader: webpack.RuleSetRule = {
  loader: 'file-loader',
  exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
  options: {
    name: `${paths.staticMedia}[name].[contenthash].[ext]`,
  },
};
