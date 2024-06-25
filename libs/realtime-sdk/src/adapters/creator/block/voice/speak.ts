import { Utils } from '@voiceflow/common';
import type { VoiceModels, VoiceNode } from '@voiceflow/voice-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import { DialogType } from '../../../../constants';
import type { NodeData } from '../../../../models';
import type { SpeakData } from '../../../../models/Speak';
import { baseSpeakAdapter } from '../base';
import { createBlockAdapter } from '../utils';

export const voiceSpeakDialogAdapter = createMultiAdapter<
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
  { audioVoice: string },
  { audioVoice: string; defaultVoice: string }
>(
  ({ dialogs, ...baseData }, { audioVoice, ...options }) => ({
    ...baseSpeakAdapter.fromDB(baseData, options),
    dialogs: voiceSpeakDialogAdapter.mapFromDB(dialogs, { audioVoice }),
  }),
  ({ dialogs, ...baseData }, { audioVoice, defaultVoice, ...options }) => ({
    ...baseSpeakAdapter.toDB(baseData, options),
    dialogs: voiceSpeakDialogAdapter.mapToDB(dialogs, { audioVoice, defaultVoice }),
  })
);

export default speakAdapter;
