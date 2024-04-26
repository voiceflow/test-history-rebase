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
      'no-secrets/no-secrets': 'off',
      'import/first': 'off',
    },
  },
];
