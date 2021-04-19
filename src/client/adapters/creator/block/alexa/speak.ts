import { Voice } from '@voiceflow/alexa-types';
import { StepData } from '@voiceflow/general-types/build/nodes/speak';
import cuid from 'cuid';

import { DialogType } from '@/constants';
import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const speakAdapter = createBlockAdapter<StepData<Voice>, NodeData.Speak>(
  ({ randomize, dialogs, canvasVisibility }) => ({
    randomize,
    canvasVisibility,
    dialogs: dialogs.map(({ voice, content }) =>
      voice === Voice.AUDIO ? { id: cuid.slug(), url: content, type: DialogType.AUDIO } : { id: cuid.slug(), type: DialogType.VOICE, voice, content }
    ),
  }),
  ({ randomize, dialogs, canvasVisibility }) => ({
    randomize,
    canvasVisibility,
    dialogs: dialogs.map((data) =>
      data.type === DialogType.AUDIO
        ? { voice: Voice.AUDIO, content: data.url ?? '' }
        : { voice: (data.voice as Voice) ?? Voice.ALEXA, content: data.content ?? '' }
    ),
  })
);

export default speakAdapter;
