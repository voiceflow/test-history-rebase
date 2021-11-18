import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import PromptEditor from './PromptEditor';
import PromptStep from './PromptStep';
import { EDITORS_BY_PATH } from './subeditors';

const PromptManager: NodeManagerConfig<Realtime.NodeData.Prompt, Realtime.NodeData.PromptBuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Prompts will stop & listen to the user to match an intent',
  label: 'Prompt',

  step: PromptStep,
  editor: PromptEditor,
  editorsByPath: EDITORS_BY_PATH,
};

export default PromptManager;
