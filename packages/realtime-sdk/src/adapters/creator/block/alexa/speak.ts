import { Constants, Node } from '@voiceflow/alexa-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';
import { voiceSpeakAdapter } from '../voice';

const speakAdapter = createBlockAdapter<Node.Speak.StepData, NodeData.Speak>(
  (data) => voiceSpeakAdapter.fromDB(data, { audioVoice: Constants.Voice.AUDIO }),
  (data) => voiceSpeakAdapter.toDB(data, { audioVoice: Constants.Voice.AUDIO, defaultVoice: Constants.Voice.ALEXA })
);

export default speakAdapter;
