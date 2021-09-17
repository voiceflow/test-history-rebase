import { composeConfigs, createPartialConfig, resolvePath } from '@voiceflow/webpack-config';
import buildConfig from '@voiceflow/webpack-config/build/configs/build';
import serveConfig from '@voiceflow/webpack-config/build/configs/serve';
import { babelLoader } from '@voiceflow/webpack-config/build/loaders';
import { mergeWithRules } from 'webpack-merge';

import commonConfig from './common';
import opts from './opts';

const options = { ...opts, paths: { ...opts.paths, tsconfig: 'tsconfig.serve.json' } };

export default mergeWithRules({
  module: {
    rules: {
      oneOf: {
        test: 'match',
        include: 'replace',
        options: 'merge',
      },
    },
  },
})(
  composeConfigs(
    commonConfig,
    buildConfig(),
    serveConfig(),
    createPartialConfig(() => ({
      watchOptions: {
        followSymlinks: true,
      },
    }))()
  )(options),
  composeConfigs(
    createPartialConfig((config) => ({
      module: {
        rules: [
          {
            oneOf: [
              {
                ...babelLoader(config),
                include: [
                  resolvePath(config, config.paths.sourceDir),
                  resolvePath(config, '../ui/src/'),
                  resolvePath(config, '../realtime-sdk/src/'),
                ],
                options: {
                  presets: ['@voiceflow/babel-preset'],
                },
              },
            ],
          },
        ],
      },
    }))()
  )(options)
);
