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
  overrides: [
    {
      files: ['test/**/*', 'src/test/**/*', 'config/**/*', '*.config.js', '.*rc.js', '*.test.ts'],
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
      files: ['*.unit.*'],
      extends: ['@voiceflow/eslint-config/mocha'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};
