import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import SpeakEditor from './SpeakEditor';
import SpeakStep from './SpeakStep';

const SpeakManager: NodeManagerConfig<Realtime.NodeData.Speak> = {
  ...NODE_CONFIG,

  tip: 'Tell Alexa what to say, or play audio clips',
  label: 'Speak',
  getDataLabel: (data) => NODE_CONFIG.factory(data).data.name,

  step: SpeakStep,
  editor: SpeakEditor,
};

export default SpeakManager;
