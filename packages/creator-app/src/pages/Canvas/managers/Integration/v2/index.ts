import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import { NODE_CONFIG_V2 } from './constants';
import IntegrationStep from './IntegrationStep';

const IntegrationManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts>> = {
  ...NODE_CONFIG_V2,
  getDataLabel: (data) => NODE_CONFIG_V2.factory(data).data.name,
  step: IntegrationStep,
};

export default IntegrationManagerV2;
