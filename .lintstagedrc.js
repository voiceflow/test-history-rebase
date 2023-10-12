module.exports = {
  '**/package.json': ['prettier --write'],
  '**/*.{js,ts,jsx,tsx}': ['eslint --fix'],
  '!**/*.{js,ts,jsx,tsx}': ['prettier --write'],
  '**/*dockerfile': ['hadolint --ignore DL3018'],
};
