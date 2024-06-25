import type * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import type { NodeManagerConfigV2 } from '../types';
import { Action, ActionEditor, Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const IntegrationManager: NodeManagerConfigV2<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts> =
  {
    ...NODE_CONFIG,

    label: 'API',

    step: Step,
    action: Action,
    editorV2: Editor,
    actionEditor: ActionEditor,

    tooltipLink: Documentation.API_STEP,
  };

export default IntegrationManager;
