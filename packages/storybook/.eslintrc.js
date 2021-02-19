module.exports = {
  extends: ['../../.eslintrc', '@voiceflow/eslint-config/utility'],
  rules: {
    // off
    'no-secrets/no-secrets': 'off',

    'xss/no-mixed-html': 'off',

    'react-hooks/rules-of-hooks': 'off',

    'import/prefer-default-export': 'off',
  },
};
