import { composeConfigs } from '@voiceflow/webpack-config';
import buildConfig from '@voiceflow/webpack-config/build/configs/build';

import commonConfig from './common';
import opts from './opts';

export default composeConfigs(commonConfig, buildConfig())(opts);
