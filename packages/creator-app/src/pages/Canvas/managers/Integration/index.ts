import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import IntegrationEditor from './IntegrationEditor';
import IntegrationStep from './IntegrationStep';

const IntegrationManager: NodeManagerConfig<NodeData.Integration> = {
  ...NODE_CONFIG,

  tip: 'Integrate external services into your skill',
  label: 'Integrations',
  getDataLabel: (data) => NODE_CONFIG.factory(data).data.name,

  step: IntegrationStep,
  editor: IntegrationEditor,
};

export default IntegrationManager;
