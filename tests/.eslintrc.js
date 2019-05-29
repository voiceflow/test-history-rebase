'use strict';

const root = require('../.eslintrc.js');

module.exports = {
  ...root,
  rules: {
    ...root.rules,
    'no-unused-expressions': 'off',
  }
};
