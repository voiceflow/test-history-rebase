import CircularDependencyPlugin from 'circular-dependency-plugin';
import DeadCodePlugin from 'webpack-deadcode-plugin';

import { IS_PRODUCTION } from '../config';

export const circularDependencyPlugin = (opts: CircularDependencyPlugin.Options = {}) =>
  new CircularDependencyPlugin({
    exclude: /node_modules/,
    cwd: process.cwd(),

    onDetected({ paths, compilation }) {
      compilation.errors.push(new Error(`Circular dependency detected:\n${paths.join(' -> ')}`));
    },
    ...opts,
  });

export const deadCodePlugin = (opts: DeadCodePlugin['options'] = {}) =>
  new DeadCodePlugin({
    failOnHint: IS_PRODUCTION,
    ...opts,
  }) as any;
