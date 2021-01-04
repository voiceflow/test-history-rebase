module.exports = {
  'package.json': ['fixpack'],
  '**/*.{js,ts,jsx,tsx}': ['eslint --fix', 'prettier-eslint --write'],
  '**/*.css': ['stylelint'],
  '*.dockerfile': ['hadolint --ignore DL3018'],
};
