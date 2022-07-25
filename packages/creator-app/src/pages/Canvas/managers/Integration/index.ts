import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import IntegrationEditor from './IntegrationEditor';
import IntegrationStep from './IntegrationStep';
import IntegrationManagerV2 from './v2';

const IntegrationManager: NodeManagerConfig<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Integrations',
  getDataLabel: (data) => NODE_CONFIG.factory(data).data.name,

  step: IntegrationStep,
  editor: IntegrationEditor,

  v2: IntegrationManagerV2,

  tooltipLink: Documentation.API_STEP,
};

export default IntegrationManager;
