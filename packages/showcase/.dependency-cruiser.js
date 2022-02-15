const { createConfig } = require('@voiceflow/dependency-cruiser-config');

module.exports = createConfig({
  tsconfig: 'tsconfig.build.json',
});
