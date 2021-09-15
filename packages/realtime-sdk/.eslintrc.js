const path = require('path');

module.exports = {
  extends: ['@voiceflow/eslint-config/typescript'],
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, 'tsconfig.json'),
      },
    },
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/tests/**/*.ts'] }],
  },
};
