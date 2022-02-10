import { NodeData } from '@realtime-sdk/models';
import { AlexaConstants, AlexaNode } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';
import { voiceSpeakAdapter } from '../voice';

const speakAdapter = createBlockAdapter<AlexaNode.Speak.StepData, NodeData.Speak>(
  (data) => voiceSpeakAdapter.fromDB(data, { audioVoice: AlexaConstants.Voice.AUDIO }),
  (data) => voiceSpeakAdapter.toDB(data, { audioVoice: AlexaConstants.Voice.AUDIO, defaultVoice: AlexaConstants.Voice.ALEXA })
);

export default speakAdapter;
