import { composeConfigs } from '@voiceflow/webpack-config';

import commonConfig from './common';
import opts from './opts';

export default composeConfigs(commonConfig)(opts);
