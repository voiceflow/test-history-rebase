import { Voice as AlexaVoice } from '@voiceflow/alexa-types';
import { Voice } from '@voiceflow/google-types';
import { StepData } from '@voiceflow/google-types/build/nodes/speak';

import { DialogType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const speakAdapter = createBlockAdapter<StepData, NodeData.Speak>(
  ({ randomize, dialogs }, { platform }) => ({
    randomize,
    dialogs: dialogs.map(({ voice, content, desc }) =>
      voice === Voice.AUDIO
        ? {
            type: DialogType.AUDIO,
            url: content,
            ...(platform === PlatformType.GOOGLE && { desc }), // google specific field
          }
        : {
            type: DialogType.VOICE,
            voice,
            content,
          }
    ),
  }),
  ({ randomize, dialogs }, { platform }) => ({
    randomize,
    dialogs: dialogs.map(({ content = '', type, url = '', voice = AlexaVoice.ALEXA, desc }) =>
      type === DialogType.AUDIO
        ? {
            voice: Voice.AUDIO,
            content: url,
            ...(platform === PlatformType.GOOGLE && { desc }), // google specific field
          }
        : {
            voice: voice as Voice,
            content,
          }
    ),
  })
);

export default speakAdapter;
