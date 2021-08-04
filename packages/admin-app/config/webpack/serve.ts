import { composeConfigs, createPartialConfig } from '@voiceflow/webpack-config';
import buildConfig from '@voiceflow/webpack-config/build/configs/build';
import serveConfig from '@voiceflow/webpack-config/build/configs/serve';

import commonConfig from './common';
import opts from './opts';

export default composeConfigs(
  commonConfig,
  buildConfig(),
  serveConfig(),
  createPartialConfig(() => ({
    watchOptions: {
      followSymlinks: true,
    },
  }))()
)(opts);
