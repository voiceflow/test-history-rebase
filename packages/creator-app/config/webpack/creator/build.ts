import { composeConfigs, createPartialConfig, resolvePath } from '@voiceflow/webpack-config';
import buildConfig from '@voiceflow/webpack-config/build/configs/build';
import FileManagerPlugin from 'filemanager-webpack-plugin';
import path from 'path';

import commonConfig from './common';
import opts from './opts';

export default composeConfigs(
  commonConfig,
  buildConfig(),
  createPartialConfig((config) => ({
    plugins: [
      new FileManagerPlugin({
        events: {
          onEnd: {
            copy: [
              {
                source: resolvePath(config, path.join(config.paths.buildDir, 'index.html')),
                destination: resolvePath(config, path.join(config.paths.buildDir, 'prototype.html')),
              },
            ],
          },
        },
      }),
    ],
  }))()
)(opts);
