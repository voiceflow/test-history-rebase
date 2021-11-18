import { NodeData } from '@realtime-sdk/models';
import { Constants, Node } from '@voiceflow/general-types';

import { createBlockAdapter } from '../utils';
import { voiceSpeakAdapter } from '../voice';

const speakAdapter = createBlockAdapter<Node.Speak.StepData, NodeData.Speak>(
  (data) => voiceSpeakAdapter.fromDB(data, { audioVoice: Constants.Voice.AUDIO }),
  (data) => voiceSpeakAdapter.toDB(data, { audioVoice: Constants.Voice.AUDIO, defaultVoice: Constants.Voice.DEFAULT })
);

export default speakAdapter;
