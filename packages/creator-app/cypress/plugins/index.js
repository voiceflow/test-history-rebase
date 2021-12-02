const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = (on) => {
  on(
    'file:preprocessor',
    webpackPreprocessor({
      webpackOptions: {
        resolve: {
          extensions: ['.tsx', '.ts', '.js'],
        },
        mode: 'development',
        module: {
          rules: [
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
