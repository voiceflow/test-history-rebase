require('ts-node/register/transpile-only');

const webpackConfig = require('./config/webpack/creator/test').default;

process.env.NODE_ENV = 'test';

module.exports = function (wallaby) {
  return {
    files: [{ pattern: 'src/**/*.{js,jsx,ts,tsx}', load: false }, '!src/**/*.it.*'],

    tests: [{ pattern: 'test/**/*.unit.ts', load: false }, '!test/pages/Prototype/**/*'],

    testFramework: 'mocha',

    postprocessor: wallaby.postprocessors.webpack(webpackConfig, {
      setupFiles: ['./config/test/unit/setup.js'],
    }),

    setup() {
      window.__moduleBundler.loadTests();
    },
  };
};
