import type * as Realtime from '@voiceflow/realtime-sdk';

import type { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const PromptManager: NodeManagerConfigV2<Realtime.NodeData.Prompt, Realtime.NodeData.PromptBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Prompt',

  step: Step,
  editorV2: Editor,
};

export default PromptManager;
