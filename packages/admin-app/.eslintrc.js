require('ts-node/register/transpile-only');

const path = require('path');

module.exports = {
  extends: ['@voiceflow/eslint-config/frontend', '@voiceflow/eslint-config/typescript'],
  rules: {
    // high performance overhead
    'import/named': 'off',
    'import/no-cycle': 'off',

    // common pattern when writing styled components
    'sonarjs/no-nested-template-literals': 'off',
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
      files: ['*.unit.*', '*.it.*', 'test/**/*', 'cypress/**/*', 'config/**/*', '*.config.js', '.*rc.js'],
      extends: ['@voiceflow/eslint-config/utility'],
      rules: {
        // off
        'no-use-before-define': 'off',

        'no-secrets/no-secrets': 'off',

        'xss/no-mixed-html': 'off',

        'react-hooks/rules-of-hooks': 'off',

        'import/prefer-default-export': 'off',
        'import/no-cycle': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['*.it.*'],
      extends: ['@voiceflow/eslint-config/jest'],
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
