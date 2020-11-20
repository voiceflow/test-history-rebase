import { Voice } from '@voiceflow/alexa-types';
import { StepData } from '@voiceflow/general-types/build/nodes/speak';
import cuid from 'cuid';

import { DialogType } from '@/constants';
import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const speakAdapter = createBlockAdapter<StepData<Voice>, NodeData.Speak>(
  ({ randomize, dialogs }) => ({
    randomize,
    dialogs: dialogs.map(({ voice, content }) =>
      voice === Voice.AUDIO ? { id: cuid.slug(), url: content, type: DialogType.AUDIO } : { id: cuid.slug(), type: DialogType.VOICE, voice, content }
    ),
  }),
  ({ randomize, dialogs }) => ({
    randomize,
    dialogs: dialogs.map(({ content = '', type, url = '', voice = Voice.ALEXA }) =>
      type === DialogType.AUDIO ? { voice: Voice.AUDIO, content: url } : { voice: voice as Voice, content }
    ),
  })
);

export default speakAdapter;
