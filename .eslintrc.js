module.exports = {
  extends: ['@voiceflow/eslint-config'],
  rules: {
    // reports false positives
    'no-use-before-define': 'off',
  },
  overrides: [
    {
      files: '.eslintrc.js',
      extends: ['@voiceflow/eslint-config/utility'],
      settings: {
        'import/resolver': {
          node: {},
        },
      },
    },
  ],
  settings: {
    jest: {
      version: 27,
    },
  },
};
