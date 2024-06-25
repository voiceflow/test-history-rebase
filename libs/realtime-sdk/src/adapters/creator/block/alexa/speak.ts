import type { NodeData } from '@realtime-sdk/models';
import type { AlexaNode } from '@voiceflow/alexa-types';
import { AlexaConstants } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';
import { voiceSpeakAdapter } from '../voice';

const speakAdapter = createBlockAdapter<AlexaNode.Speak.StepData, NodeData.Speak>(
  (data, options) => voiceSpeakAdapter.fromDB(data, { ...options, audioVoice: AlexaConstants.Voice.AUDIO }),
  (data, options) =>
    voiceSpeakAdapter.toDB(data, {
      ...options,
      audioVoice: AlexaConstants.Voice.AUDIO,
      defaultVoice: AlexaConstants.Voice.ALEXA,
    })
);

export default speakAdapter;
