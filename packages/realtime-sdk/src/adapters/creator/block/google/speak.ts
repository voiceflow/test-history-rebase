import { Constants, Node } from '@voiceflow/general-types';
import cuid from 'cuid';

import { DialogType } from '../../../../constants';
import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const speakAdapter = createBlockAdapter<Node.Speak.StepData, NodeData.Speak>(
  ({ randomize, dialogs, canvasVisibility }) => ({
    randomize,
    canvasVisibility,
    dialogs: dialogs.map(({ voice, content, desc }) =>
      voice === Constants.Voice.AUDIO
        ? { id: cuid.slug(), url: content, type: DialogType.AUDIO, desc }
        : { id: cuid.slug(), type: DialogType.VOICE, voice, content }
    ),
  }),
  ({ randomize, dialogs, canvasVisibility }) => ({
    randomize,
    canvasVisibility,
    dialogs: dialogs.map((data) =>
      data.type === DialogType.AUDIO
        ? { voice: Constants.Voice.AUDIO, content: data.url ?? '', desc: data.desc }
        : { voice: (data.voice as Constants.Voice) ?? Constants.Voice.DEFAULT, content: data.content ?? '' }
    ),
  })
);

export default speakAdapter;
