import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import webpack from 'webpack';

import paths from '../../paths';
import { IS_PRODUCTION } from '../config';

export const typecheckPlugin = new ForkTSCheckerWebpackPlugin({
  typescript: {
    configFile: path.resolve(__dirname, '../../../tsconfig.build.json'),
    configOverwrite: {
      compilerOptions: { skipLibCheck: true },
    },
    diagnosticOptions: {
      syntactic: false,
    },
  },
});

export const babelLoader: webpack.RuleSetRule = {
  test: /\.[jt]sx?$/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    cacheCompression: IS_PRODUCTION,
    compact: IS_PRODUCTION,
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

export const svgLoader: webpack.RuleSetRule = {
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
};

export const styleLoader: webpack.RuleSetRule = {
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
};

export const fileLoader: webpack.RuleSetRule = {
  loader: 'file-loader',
  exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
  options: {
    name: `${paths.staticMedia}[name].[hash:8].[ext]`,
  },
};
