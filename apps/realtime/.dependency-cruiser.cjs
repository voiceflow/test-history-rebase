const { createConfig } = require('@voiceflow/dependency-cruiser-config');

module.exports = createConfig({
  ignore: ["src/test/index.ts", "src/test/controller.ts"],
  tsconfig: 'tsconfig.build.json',
  allowTypeCycles: true,
});
