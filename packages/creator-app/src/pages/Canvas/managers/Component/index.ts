import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV2 } from '../types';
import { Action, ActionEditor, Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const ComponentManager: NodeManagerConfigV2<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Component',

  step: Step,
  action: Action,
  editorV2: Editor,
  actionEditor: ActionEditor,

  tooltipText: 'Points the conversation to an existing Component.',
  tooltipLink: Documentation.COMPONENT_STEP,
};

export default ComponentManager;
