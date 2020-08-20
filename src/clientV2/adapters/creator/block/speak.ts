import { Voice } from '@voiceflow/alexa-types';
import { StepData } from '@voiceflow/alexa-types/lib/nodes/speak';

import { DialogType } from '@/constants';
import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const speakAdapter = createBlockAdapter<StepData, NodeData.Speak>(
  ({ randomize, dialogs }) => ({
    randomize,
    dialogs: dialogs.map(({ voice, content }) =>
      voice === Voice.AUDIO
        ? {
            type: DialogType.AUDIO,
            url: content,
          }
        : {
            type: DialogType.VOICE,
            voice,
            content,
          }
    ),
  }),
  ({ randomize, dialogs }) => ({
    randomize,
    dialogs: dialogs.map(({ content = '', type, url = '', voice = Voice.ALEXA }) =>
      type === DialogType.AUDIO
        ? {
            voice: Voice.AUDIO,
            content: url,
          }
        : {
            voice: voice as Voice,
            content,
          }
    ),
  })
);

export default speakAdapter;
