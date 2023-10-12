const prettierConfig = require("@voiceflow/prettier-config");

/** @type {import('prettier').Options} */
module.exports = {
  ...prettierConfig,
  printWidth: 120,
  plugins: ["prettier-plugin-packagejson"],
};
