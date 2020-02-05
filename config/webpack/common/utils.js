const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  circularDependencyPlugin: (opts = {}) =>
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      cwd: process.cwd(),

      onDetected({ paths, compilation }) {
        compilation.errors.push(new Error(`Circular dependency detected:\n${paths.join(' -> ')}`));
      },
      ...opts
    })
};