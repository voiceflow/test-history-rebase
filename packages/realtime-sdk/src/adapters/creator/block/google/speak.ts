import { DialogType } from '@realtime-sdk/constants';
import { NodeData } from '@realtime-sdk/models';
import { Constants, Node } from '@voiceflow/google-types';

import { createBlockAdapter } from '../utils';
import { voiceSpeakAdapter, voiceSpeakDialogAdapter } from '../voice';

const speakAdapter = createBlockAdapter<Node.Speak.StepData, NodeData.Speak>(
  (data) => ({
    ...voiceSpeakAdapter.fromDB(data, { audioVoice: Constants.Voice.AUDIO }),
    dialogs: data.dialogs.map((dialog) => ({
      ...voiceSpeakDialogAdapter.fromDB(dialog, { audioVoice: Constants.Voice.AUDIO }),
      desc: dialog.desc,
    })),
  }),
  (data) => ({
    ...voiceSpeakAdapter.toDB(data, { audioVoice: Constants.Voice.AUDIO, defaultVoice: Constants.Voice.DEFAULT }),
    dialogs: data.dialogs.map((dialog) => ({
      ...voiceSpeakDialogAdapter.toDB(dialog, { audioVoice: Constants.Voice.AUDIO, defaultVoice: Constants.Voice.DEFAULT }),
      desc: dialog.type === DialogType.AUDIO ? dialog.desc : undefined,
    })),
  })
);

export default speakAdapter;
