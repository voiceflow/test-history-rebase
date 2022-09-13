import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const ComponentManager: NodeManagerConfigV2<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Component',

  step: Step,
  editorV2: Editor,

  tooltipText: 'Points the conversation to an existing Component.',
  tooltipLink: Documentation.COMPONENT_STEP,
};

export default ComponentManager;
