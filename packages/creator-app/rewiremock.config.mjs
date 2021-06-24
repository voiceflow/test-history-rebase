import { plugins, resolveExtensions } from 'rewiremock';

resolveExtensions(['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']);

export default (rewiremock) => {
  rewiremock.addPlugin(plugins.relative);
  rewiremock.addPlugin(plugins.usedByDefault);
  rewiremock.addPlugin(plugins.protectNodeModules);
};
