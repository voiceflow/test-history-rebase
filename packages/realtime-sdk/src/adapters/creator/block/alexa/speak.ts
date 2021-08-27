import { Constants, Node } from '@voiceflow/alexa-types';
import cuid from 'cuid';

import { DialogType } from '../../../../constants';
import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const speakAdapter = createBlockAdapter<Node.Speak.StepData, NodeData.Speak>(
  ({ randomize, dialogs, canvasVisibility }) => ({
    randomize,
    canvasVisibility,
    dialogs: dialogs.map(({ voice, content }) =>
      voice === Constants.Voice.AUDIO
        ? { id: cuid.slug(), url: content, type: DialogType.AUDIO }
        : { id: cuid.slug(), type: DialogType.VOICE, voice, content }
    ),
  }),
  ({ randomize, dialogs, canvasVisibility }) => ({
    randomize,
    canvasVisibility,
    dialogs: dialogs.map((data) =>
      data.type === DialogType.AUDIO
        ? { voice: Constants.Voice.AUDIO, content: data.url ?? '' }
        : { voice: (data.voice as Constants.Voice) ?? Constants.Voice.ALEXA, content: data.content ?? '' }
    ),
  })
);

export default speakAdapter;
