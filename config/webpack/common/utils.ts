import CircularDependencyPlugin from 'circular-dependency-plugin';

export const circularDependencyPlugin = (opts: CircularDependencyPlugin.Options = {}) =>
  new CircularDependencyPlugin({
    exclude: /node_modules/,
    cwd: process.cwd(),

    onDetected({ paths, compilation }) {
      compilation.errors.push(new Error(`Circular dependency detected:\n${paths.join(' -> ')}`));
    },
    ...opts,
  });
