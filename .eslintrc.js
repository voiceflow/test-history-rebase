const path = require('path');

module.exports = {
  extends: ['@voiceflow/eslint-config'],
  rules: {
    // reports false positives
    'no-use-before-define': 'off',
  },
  overrides: [
    {
      files: '.eslintrc.js',
      extends: ['@voiceflow/eslint-config/utility'],
      settings: {
        'import/resolver': {
          node: {},
        },
      },
    },
  ],
  settings: {
    'import/resolver': {
      'eslint-import-resolver-lerna': {
        packages: [path.resolve(__dirname, 'libs'), path.resolve(__dirname, 'apps')],
      },
    },

    jest: {
      version: 27,
    },
  },
};
