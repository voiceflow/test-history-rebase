const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const webpack = require('webpack');

module.exports = (on) => {
  on(
    'file:preprocessor',
    webpackPreprocessor({
      webpackOptions: {
        resolve: {
          extensions: ['.tsx', '.ts', '.js'],
        },
        mode: 'development',
        plugins: [
          new webpack.DefinePlugin({
            'process.env': JSON.stringify({}),
          }),
        ],
        module: {
          rules: [
            {
              test: /\.(svg|css)$/,
              loader: 'null-loader',
            },
            {
              test: /node_modules\/@voiceflow\/@base-types\/.*\/\.js$/,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                  },
                },
              ],
            },
            {
              test: /\.[jt]sx?$/,
              loader: 'ts-loader',
              exclude: /node_modules/,
              options: {
                transpileOnly: true,
                compilerOptions: {
                  target: 'es5',
                },
              },
            },
          ],
        },
      },
    })
  );
};
