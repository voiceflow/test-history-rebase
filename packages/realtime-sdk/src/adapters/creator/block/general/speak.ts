import { NodeData } from '@realtime-sdk/models';
import { VoiceflowConstants, VoiceflowNode } from '@voiceflow/voiceflow-types';

import { createBlockAdapter } from '../utils';
import { voiceSpeakAdapter } from '../voice';

const speakAdapter = createBlockAdapter<VoiceflowNode.Speak.StepData, NodeData.Speak>(
  (data) => voiceSpeakAdapter.fromDB(data, { audioVoice: VoiceflowConstants.Voice.AUDIO }),
  (data) => voiceSpeakAdapter.toDB(data, { audioVoice: VoiceflowConstants.Voice.AUDIO, defaultVoice: VoiceflowConstants.Voice.DEFAULT })
);

export default speakAdapter;
