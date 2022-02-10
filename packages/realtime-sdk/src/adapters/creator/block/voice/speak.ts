import { Utils } from '@voiceflow/common';
import { VoiceModels, VoiceNode } from '@voiceflow/voice-types';
import createAdapter from 'bidirectional-adapter';

import { DialogType } from '../../../../constants';
import { NodeData } from '../../../../models';
import { SpeakData } from '../../../../models/Speak';
import { baseSpeakAdapter } from '../base';
import { createBlockAdapter } from '../utils';

export const voiceSpeakDialogAdapter = createAdapter<
  VoiceModels.Prompt<any>,
  SpeakData,
  [{ audioVoice: string }],
  [{ audioVoice: string; defaultVoice: string }]
>(
  ({ voice, content }, { audioVoice }) =>
    voice === audioVoice
      ? { id: Utils.id.cuid.slug(), url: content, type: DialogType.AUDIO }
      : { id: Utils.id.cuid.slug(), type: DialogType.VOICE, voice, content },
  (data, { audioVoice, defaultVoice }) =>
    data.type === DialogType.AUDIO
      ? { voice: audioVoice, content: data.url ?? '' }
      : { voice: data.voice ?? defaultVoice, content: data.content ?? '' }
);

const speakAdapter = createBlockAdapter<
  VoiceNode.Speak.StepData<any>,
  NodeData.Speak,
  [{ audioVoice: string }],
  [{ audioVoice: string; defaultVoice: string }]
>(
  ({ dialogs, ...baseData }, { audioVoice }) => ({
    ...baseSpeakAdapter.fromDB(baseData),
    dialogs: voiceSpeakDialogAdapter.mapFromDB(dialogs, { audioVoice }),
  }),
  ({ dialogs, ...baseData }, { audioVoice, defaultVoice }) => ({
    ...baseSpeakAdapter.toDB(baseData),
    dialogs: voiceSpeakDialogAdapter.mapToDB(dialogs, { audioVoice, defaultVoice }),
  })
);

export default speakAdapter;
