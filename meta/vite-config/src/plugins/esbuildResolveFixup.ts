import path from 'path';
import type { DepOptimizationOptions } from 'vite';

const esbuildResolveFixup = ({
  match,
  resolvePath,
}: {
  match: RegExp;
  resolvePath: string;
}): Required<Required<DepOptimizationOptions>['esbuildOptions']>['plugins'][number] => ({
  name: 'resolve-fixup',
  setup(build) {
    build.onResolve({ filter: match }, async () => ({ path: path.resolve(resolvePath) }));
  },
});

export default esbuildResolveFixup;
