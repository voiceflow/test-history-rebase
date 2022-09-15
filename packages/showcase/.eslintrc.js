const path = require('path');

module.exports = {
  extends: ['@voiceflow/eslint-config/frontend', '@voiceflow/eslint-config/typescript', '@voiceflow/eslint-config/utility'],
  rules: {
    // off
    'no-use-before-define': 'off',

    'no-secrets/no-secrets': 'off',

    'xss/no-mixed-html': 'off',

    'react-hooks/rules-of-hooks': 'off',

    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': 'off',
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
      files: ['*.tsx'],
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
