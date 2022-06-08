import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import { NODE_CONFIG_V2 } from './constants';
import IntegrationEditor from './IntegrationEditor';
import IntegrationStep from './IntegrationStep';

const IntegrationManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts>> = {
  ...NODE_CONFIG_V2,
  getDataLabel: (data) => NODE_CONFIG_V2.factory(data).data.name,
  step: IntegrationStep,
  editorV2: IntegrationEditor,
};

export default IntegrationManagerV2;
