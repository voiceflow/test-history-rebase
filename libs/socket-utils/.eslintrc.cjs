const path = require('path');

module.exports = {
  extends: ['@voiceflow/eslint-config/typescript'],
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, 'tsconfig.test.json'),
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
  },
  overrides: [
    {
      files: ['*.unit.*', 'test/**/*', 'config/**/*', '*.config.js', '.*rc.js'],
      extends: ['@voiceflow/eslint-config/utility'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['*.unit.*', '*.it.*'],
      extends: ['@voiceflow/eslint-config/mocha'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};
