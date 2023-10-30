module.exports = {
  '**/package.json': ['prettier --write'],
  '**/*.{js,ts,jsx,tsx}': ['eslint --fix'],
  '**/*.{json,md,yaml,yml,svg,css,scss}': ['prettier --write'],
  '**/*dockerfile': ['hadolint --ignore DL3018'],
};
