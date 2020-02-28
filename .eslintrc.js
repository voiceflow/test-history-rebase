const { default: webpackConfig } = require('./config/webpack/common');

module.exports = {
  extends: ['@voiceflow/eslint-config/frontend', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', 'react-hooks', '@typescript-eslint'],
  rules: {
    // errors
    'no-param-reassign': ['error', { props: false }],
    'react/jsx-fragments': 'error',
    'no-console': ['error', { allow: ['error'] }],
    quotes: ['error', 'single', 'avoid-escape'],
    'no-secrets/no-secrets': ['error', { tolerance: 4.45 }],
    'lodash/path-style': ['error', 'array'],
    'no-use-before-define': ['error', 'nofunc'],
    'prefer-destructuring': [
      'error',
      {
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
    ],
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
    'class-methods-use-this': ['error', { exceptMethods: ['render'] }],
    'lodash/preferred-alias': ['error', { ignoreMethods: ['first'] }],
    'react-hooks/rules-of-hooks': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],

    // disabled
    'react/no-unescaped-entities': 'off',
    'promise/always-return': 'off',
    'no-unused-expressions': 'off',
    'lodash/prefer-lodash-chain': 'off',
    'import/no-named-as-default': 'off',
    'import/extensions': 'off',
    'require-jsdoc': 'off',
    'filenames/match-regex': 'off',
    'filenames/match-exported': 'off',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'lodash/import-scope': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'no-prototype-builtins': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',

    // disabled temporarily by setting as warnings
    'max-len': 'warn',
    camelcase: 'warn',
    'react/jsx-curly-brace-presence': 'warn',
    'optimize-regex/optimize-regex': 'warn',
    'lodash/prefer-lodash-typecheck': 'warn',
    'simple-import-sort/sort': 'warn',
    'consistent-return': 'warn',
    'sonarjs/no-duplicated-branches': 'warn',
    'sonarjs/cognitive-complexity': 'warn',
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],
    'import/prefer-default-export': 'warn',
    'no-process-env': 'warn',
    'no-shadow': 'warn',
    'max-depth': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/label-has-for': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'promise/catch-or-return': 'warn',
    'import/no-cycle': 'warn',
    'react/display-name': 'warn',
  },
  settings: {
    polyfills: [
      'Number.isNaN',
      'Promise',
      'Array.from',
      'Object.assign',
      'Object.values',
      'Object.entries',
      'Set',
      'TextEncoder',
      'window.performance',
      'performance',
    ],
    'import/resolver': {
      webpack: {
        config: webpackConfig,
      },
    },
    'import/extensions': ['.js', '.ts', '.jsx', '.tsx'],
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['*.story.*', '*.unit.*', '*.it.*', 'src/utils/testing/**/*', 'test/**/*', 'config/**/*'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'no-secrets/no-secrets': 'off',
        'xss/no-mixed-html': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'lodash/prefer-constant': 'off',
        'import/prefer-default-export': 'off',
      },
    },
    {
      files: ['config/**/*'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**/_suite.js', '*.unit.*'],
      rules: {
        'jest/valid-expect': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'import/no-unresolved': 'off',
        'import/export': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-namespace': 'off',
        'valid-jsdoc': 'off',
      },
    },
  ],
};
