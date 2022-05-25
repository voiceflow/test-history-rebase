import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import { NODE_CONFIG } from './constants';
import IntegrationStep from './IntegrationStep';

const IntegrationManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts>> = {
  ...NODE_CONFIG,
  step: IntegrationStep,
};

export default IntegrationManagerV2;
