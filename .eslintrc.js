// eslint-disable-next-line import/no-extraneous-dependencies
require('ts-node/register/transpile-only');

// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

module.exports = {
  extends: ['@voiceflow/eslint-config', '@voiceflow/eslint-config/frontend', '@voiceflow/eslint-config/typescript'],
  rules: {
    // error
    'no-process-env': 'error',
    'no-secrets/no-secrets': ['error', { tolerance: 4.45 }],

    // warn until fixed
    camelcase: 'warn',
    'consistent-return': 'warn',
    'max-classes-per-file': 'warn',
    'no-param-reassign': 'warn',
    'no-shadow': 'warn',
    'no-underscore-dangle': 'warn',
    'no-unused-expressions': 'warn',
    'lines-between-class-members': 'warn',

    'promise/catch-or-return': 'warn',
    'promise/always-return': 'warn',

    'import/no-named-as-default': 'warn',
    'import/prefer-default-export': 'warn',

    'eslint-comments/disable-enable-pair': 'warn',
    'eslint-comments/no-unused-disable': 'warn',

    'sonarjs/cognitive-complexity': 'warn',

    'you-dont-need-lodash-underscore/last': 'warn',
    'you-dont-need-lodash-underscore/throttle': 'warn',
    'you-dont-need-lodash-underscore/to-lower': 'warn',
    'you-dont-need-lodash-underscore/is-string': 'warn',
    'you-dont-need-lodash-underscore/is-function': 'warn',

    // reports false positives
    'no-use-before-define': 'off',

    // high performance overhead
    'import/named': 'off',
    'import/no-cycle': 'off',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, 'config/webpack/common'),
      },
    },
  },
  overrides: [
    {
      files: ['*.story.*', '*.unit.*', '*.it.*', 'src/utils/testing/**/*', 'test/**/*', 'cypress/**/*', 'config/**/*', 'webpack.config.js'],
      extends: ['@voiceflow/eslint-config/utility'],
      rules: {
        // off
        'no-use-before-define': 'off',

        'no-secrets/no-secrets': 'off',

        'xss/no-mixed-html': 'off',

        'react-hooks/rules-of-hooks': 'off',

        'import/prefer-default-export': 'off',
        'import/no-cycle': 'off',
      },
    },
    {
      files: ['**/_suite.js', '*.unit.*'],
      extends: ['@voiceflow/eslint-config/mocha'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['*.it.*'],
      extends: ['@voiceflow/eslint-config/jest'],
    },
    {
      files: ['cypress/**/*'],
      extends: ['@voiceflow/eslint-config/cypress'],
    },
    {
      files: ['*.jsx', '*.tsx'],
      rules: {
        // off
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],

        // off
        'no-shadow': 'off',

        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-namespace': 'off',
      },
    },
  ],
};
