import type { VoiceflowNode } from '@voiceflow/voiceflow-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import type { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';
import { voiceSpeakAdapter } from '../voice';

const speakAdapter = createBlockAdapter<VoiceflowNode.Speak.StepData, NodeData.Speak>(
  (data, options) => voiceSpeakAdapter.fromDB(data, { ...options, audioVoice: VoiceflowConstants.Voice.AUDIO }),
  (data, options) =>
    voiceSpeakAdapter.toDB(data, {
      ...options,
      audioVoice: VoiceflowConstants.Voice.AUDIO,
      defaultVoice: VoiceflowConstants.Voice.DEFAULT,
    })
);

export default speakAdapter;
