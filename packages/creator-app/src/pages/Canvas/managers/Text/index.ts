import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import TextEditor from './TextEditor';
import TextStep from './TextStep';

const TextManager: NodeManagerConfig<Realtime.NodeData.Text> = {
  ...NODE_CONFIG,

  label: 'Text',
  platforms: [Constants.PlatformType.CHATBOT, Constants.PlatformType.DIALOGFLOW_ES_CHAT],

  step: TextStep,
  editor: TextEditor,
};

export default TextManager;
