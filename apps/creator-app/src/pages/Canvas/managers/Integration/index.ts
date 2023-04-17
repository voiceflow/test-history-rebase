import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV2 } from '../types';
import { Action, ActionEditor, Editor, Step } from './components';
import { NAME_MAP, NODE_CONFIG } from './constants';

const IntegrationManager: NodeManagerConfigV2<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Integrations',
  getDataLabel: (data) => NAME_MAP[data.selectedIntegration],

  step: Step,
  action: Action,
  editorV2: Editor,
  actionEditor: ActionEditor,

  tooltipLink: Documentation.API_STEP,
};

export default IntegrationManager;
