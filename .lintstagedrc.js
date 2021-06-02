module.exports = {
  '**/package.json': ['fixpack --quiet'],
  '**/*.{js,ts,jsx,tsx}': ['eslint --fix'],
  '**/*.css': ['stylelint'],
  '**/*dockerfile': ['hadolint --ignore DL3018'],
};
