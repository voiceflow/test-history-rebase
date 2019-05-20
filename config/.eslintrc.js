'use strict';

const root = require('../.eslintrc.js');

module.exports = {
  ...root,
  rules: {
    ...root.rules,
    'no-unused-expressions': 'off',
    'no-await-in-loop': 'off',
    'strict': 'off',
    'max-depth': 'off',
    'no-restricted-syntax': 'off',
  }
};
