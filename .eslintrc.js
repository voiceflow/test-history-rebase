module.exports = {
  extends: '@voiceflow/eslint-config/frontend',
  parser: 'babel-eslint',
  rules: {
    // errors
    'no-param-reassign': ['error', { props: false }],
    'no-console': ['error', { allow: ['error'] }],
    quotes: ['error', 'single', 'avoid-escape'],
    'no-secrets/no-secrets': ['error', { tolerance: 4.2 }],
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

    // disabled
    'react/no-unescaped-entities': 'off',
    'promise/always-return': 'off',

    // disabled temporarily by setting as warnings
    'max-len': 'warn',
    camelcase: 'warn',
    'react/prop-types': 'warn',
    'import/no-unresolved': 'warn',
    'react/jsx-curly-brace-presence': 'warn',
    'react/destructuring-assignment': 'warn',
    'filenames/match-regex': 'off',
    'filenames/match-exported': 'warn',
    'optimize-regex/optimize-regex': 'warn',
    'lodash/prefer-lodash-typecheck': 'warn',
    'simple-import-sort/sort': 'warn',
    'consistent-return': 'warn',
    'sonarjs/no-duplicated-branches': 'warn',
    'sonarjs/cognitive-complexity': 'warn',
    'react/jsx-filename-extension': 'warn',
    'lodash/import-scope': 'warn',
    'import/prefer-default-export': 'warn',
    'require-jsdoc': 'warn',
    'no-process-env': 'warn',
    'no-shadow': 'warn',
    'max-depth': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/label-has-for': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'promise/catch-or-return': 'warn',
  },
};
