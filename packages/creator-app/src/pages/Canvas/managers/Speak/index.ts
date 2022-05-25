import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import SpeakEditor from './SpeakEditor';
import SpeakStep from './SpeakStep';
import SpeakManagerV2 from './v2';

const SpeakManager: NodeManagerConfig<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Speak',
  getDataLabel: (data) => NODE_CONFIG.factory(data).data.name,

  step: SpeakStep,
  editor: SpeakEditor,

  v2: SpeakManagerV2,
};

export default SpeakManager;
