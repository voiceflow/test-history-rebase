import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV2 } from '../types';
import { Action, ActionEditor, Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const CodeManager: NodeManagerConfigV2<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Javascript',

  step: Step,
  action: Action,
  editorV2: Editor,
  actionEditor: ActionEditor,

  tooltipText: 'Executes custom JavaScript (ES6) code in the assistant.',
  tooltipLink: Documentation.CODE_STEP,
};

export default CodeManager;
