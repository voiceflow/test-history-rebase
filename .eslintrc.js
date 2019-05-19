module.exports = {
  extends: '@voiceflow/eslint-config',
  rules: {
    'no-continue': 'off',
    'no-console': 'off',
    'no-process-env': 'off',
    'class-methods-use-this': 'off', // migrating away from classes anyways
    'require-jsdoc': 'off', // not surewe want this
    'quotes': ['error', 'single', 'avoid-escape'],
  }
};
