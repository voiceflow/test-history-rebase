import baseConfig from '@voiceflow/eslint-config';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...baseConfig,
  {
    ignores: ['**/generated/**', '**/svgs/*.svg.jsx'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    rules: {
      'import/no-cycle': 'off',
      'no-secrets/no-secrets': 'off',
      'sonarjs/prefer-immediate-return': 'off',
      'sonarjs/no-one-iteration-loop': 'off',
      'you-dont-need-lodash-underscore/capitalize': 'off',
    },
  },
  {
    files: ['**/*.action.ts'],

    rules: {
      '@typescript-eslint/no-namespace': 'off',
    },
  },
  {
    files: ['**/ducks/**'],

    rules: {
      'no-param-reassign': 'off',
    },
  },
];
