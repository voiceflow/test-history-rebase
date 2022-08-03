import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV2 } from '../types';
import { Action, ActionEditor, Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const SetManager: NodeManagerConfigV2<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Set',

  step: Step,
  action: Action,
  editorV2: Editor,
  actionEditor: ActionEditor,

  tooltipText: 'Sets and changes the value of variables.',
  tooltipLink: Documentation.SET_STEP,
};

export default SetManager;
