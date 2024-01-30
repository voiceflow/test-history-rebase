const path = require('path');

module.exports = {
  extends: ['@voiceflow/eslint-config/frontend', '@voiceflow/eslint-config/typescript'],
  rules: {
    // error
    'no-process-env': 'error',
    'no-secrets/no-secrets': ['error', { tolerance: 4.45 }],

    // warn until fixed
    camelcase: 'warn',
    'consistent-return': 'warn',
    'max-classes-per-file': 'warn',
    'default-param-last': 'warn',
    'no-param-reassign': 'warn',
    'no-shadow': 'warn',
    'no-restricted-exports': 'warn',
    'no-unused-expressions': 'warn',
    'no-promise-executor-return': 'warn',
    'lines-between-class-members': 'warn',

    'promise/catch-or-return': 'warn',
    'promise/always-return': 'warn',

    'unicorn/prefer-set-has': 'warn',

    'import/no-named-as-default': 'warn',

    'eslint-comments/disable-enable-pair': 'warn',
    'eslint-comments/no-unused-disable': 'warn',

    'sonarjs/cognitive-complexity': 'warn',
    'sonarjs/prefer-single-boolean-return': 'off',

    'you-dont-need-lodash-underscore/last': 'warn',
    'you-dont-need-lodash-underscore/throttle': 'warn',
    'you-dont-need-lodash-underscore/to-lower': 'warn',
    'you-dont-need-lodash-underscore/is-string': 'warn',
    'you-dont-need-lodash-underscore/is-function': 'warn',

    'jsx-a11y/no-autofocus': 'off',

    // high performance overhead
    'import/named': 'off',
    'import/no-cycle': 'off',

    // common pattern when writing styled components
    'sonarjs/no-nested-template-literals': 'off',

    'import/extensions': ['error', 'ignorePackages', { ts: 'never', js: 'never', tsx: 'never', jsx: 'never' }],
    // 'import/no-unused-modules': [1, { unusedExports: true }],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
    },
  },
  overrides: [
    {
      files: '.eslintrc.js',
      settings: {
        'import/resolver': {
          node: {},
        },
      },
    },
    {
      files: [
        '*.story.*',
        '*.unit.*',
        '*.it.*',
        'src/utils/testing/**/*',
        'test/**/*',
        'cypress/**/*',
        'config/**/*',
        '*.config.mjs',
        '*.config.js',
        '.*rc.js',
      ],
      extends: ['@voiceflow/eslint-config/utility'],
      rules: {
        // off
        'no-use-before-define': 'off',

        'no-secrets/no-secrets': 'off',

        'xss/no-mixed-html': 'off',

        'react-hooks/rules-of-hooks': 'off',

        'import/no-cycle': 'off',
        'import/no-extraneous-dependencies': 'off',
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
        '@typescript-eslint/no-unnecessary-type-constraint': 'off',
        'no-restricted-syntax': ['warn', { selector: 'TSEnumDeclaration', message: 'TS enums are not allowed, use enum-like objects instead.' }],
      },
    },
  ],
};
