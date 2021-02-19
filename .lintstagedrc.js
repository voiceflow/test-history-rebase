module.exports = {
  'package.json': ['fixpack'],
  '**/*.{js,ts,jsx,tsx}': ['eslint --fix'],
  '**/*.css': ['stylelint'],
  '*.dockerfile': ['hadolint --ignore DL3018'],
};
