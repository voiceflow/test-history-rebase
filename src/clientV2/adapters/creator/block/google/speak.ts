import { StepData } from '@voiceflow/general-types/build/nodes/speak';
import { Voice } from '@voiceflow/google-types';

import { DialogType } from '@/constants';
import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const speakAdapter = createBlockAdapter<StepData<Voice>, NodeData.Speak>(
  ({ randomize, dialogs }) => ({
    randomize,
    dialogs: dialogs.map(({ voice, content, desc }) =>
      voice === Voice.AUDIO ? { url: content, type: DialogType.AUDIO, desc } : { type: DialogType.VOICE, voice, content }
    ),
  }),
  ({ randomize, dialogs }) => ({
    randomize,
    dialogs: dialogs.map(({ content = '', type, url = '', voice = Voice.DEFAULT, desc }) =>
      type === DialogType.AUDIO ? { desc, voice: Voice.AUDIO, content: url } : { voice: voice as Voice, content }
    ),
  })
);

export default speakAdapter;
