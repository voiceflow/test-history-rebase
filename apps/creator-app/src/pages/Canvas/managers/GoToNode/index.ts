import type * as Realtime from '@voiceflow/realtime-sdk';

import type { NodeManagerConfigV2 } from '../types';
import { Action, ActionEditor, Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const GoToDomainManager: NodeManagerConfigV2<Realtime.NodeData.GoToNode> = {
  ...NODE_CONFIG,

  label: 'Go to Domain',

  step: Step,
  action: Action,
  editorV2: Editor,
  actionEditor: ActionEditor,
};

export default GoToDomainManager;
