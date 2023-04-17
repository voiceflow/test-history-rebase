const path = require('path');

module.exports = {
  extends: ['@voiceflow/eslint-config/frontend', '@voiceflow/eslint-config/typescript'],
  rules: {
    // common pattern when writing styled components
    'sonarjs/no-nested-template-literals': 'off',

    'jsx-a11y/no-autofocus': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, 'tsconfig.json'),
      },
    },
  },
  overrides: [
    {
      files: ['test/**/*', 'config/**/*', '*.config.js', '.*rc.js'],
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
    {
      files: ['*.it.*', 'config/test/integration/setup.js'],
      extends: ['@voiceflow/eslint-config/jest'],
    },
  ],
};
