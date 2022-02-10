import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import TextEditor from './TextEditor';
import TextStep from './TextStep';

const TextManager: NodeManagerConfig<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Text',
  platforms: [VoiceflowConstants.PlatformType.CHATBOT, VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT],

  step: TextStep,
  editor: TextEditor,
};

export default TextManager;
