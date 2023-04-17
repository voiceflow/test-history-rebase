import { DialogType } from '@realtime-sdk/constants';
import { NodeData } from '@realtime-sdk/models';
import { GoogleConstants, GoogleNode } from '@voiceflow/google-types';

import { createBlockAdapter } from '../utils';
import { voiceSpeakAdapter, voiceSpeakDialogAdapter } from '../voice';

const speakAdapter = createBlockAdapter<GoogleNode.Speak.VoiceStepData, NodeData.Speak>(
  (data, options) => ({
    ...voiceSpeakAdapter.fromDB(data, { ...options, audioVoice: GoogleConstants.Voice.AUDIO }),
    dialogs: data.dialogs.map((dialog) => ({
      ...voiceSpeakDialogAdapter.fromDB(dialog, { audioVoice: GoogleConstants.Voice.AUDIO }),
      desc: dialog.desc,
    })),
  }),
  (data, options) => ({
    ...voiceSpeakAdapter.toDB(data, { ...options, audioVoice: GoogleConstants.Voice.AUDIO, defaultVoice: GoogleConstants.Voice.DEFAULT }),
    dialogs: data.dialogs.map((dialog) => ({
      ...voiceSpeakDialogAdapter.toDB(dialog, { audioVoice: GoogleConstants.Voice.AUDIO, defaultVoice: GoogleConstants.Voice.DEFAULT }),
      desc: dialog.type === DialogType.AUDIO ? dialog.desc : undefined,
    })),
  })
);

export default speakAdapter;
