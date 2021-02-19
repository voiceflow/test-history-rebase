const path = require('path')

module.exports = {
  extends: ['../../.eslintrc'],
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
    'react/display-name': 'off',
    'lodash/prefer-constant': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
};
