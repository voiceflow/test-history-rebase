module.exports = {
  extends: ['../.eslintrc', 'plugin:cypress/recommended'],
  plugins: ['cypress'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'promise/catch-or-return': 'off',
  },
  env: {
    'cypress/globals': true,
  },
};
