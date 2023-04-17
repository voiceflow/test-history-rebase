import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../types';
import { Action, ActionEditor, Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const GoToIntentManager: NodeManagerConfigV2<Realtime.NodeData.GoToIntent> = {
  ...NODE_CONFIG,

  label: 'Go to Intent',

  step: Step,
  action: Action,
  editorV2: Editor,
  actionEditor: ActionEditor,
};

export default GoToIntentManager;
