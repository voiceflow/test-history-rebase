import * as Platform from '@voiceflow/platform-config/backend';
import { createMultiAdapter } from 'bidirectional-adapter';

import { DialogType } from '../constants';
import { SpeakData } from '../models';

export const voicePromptToSpeakDataAdapter = createMultiAdapter<Platform.Common.Voice.Models.Prompt.Model, SpeakData>(
  (reprompt) =>
    reprompt.type === Platform.Common.Voice.Models.Prompt.PromptType.AUDIO
      ? {
          id: reprompt.id,
          url: reprompt.audio ?? '',
          desc: reprompt.desc ?? undefined,
          type: DialogType.AUDIO,
        }
      : {
          id: reprompt.id,
          type: DialogType.VOICE,
          voice: reprompt.voice ?? '',
          content: reprompt.content,
        },
  (speakData) =>
    speakData.type === DialogType.AUDIO
      ? {
          id: speakData.id,
          type: Platform.Common.Voice.Models.Prompt.PromptType.AUDIO,
          desc: speakData.desc,
          audio: speakData.url,
          content: '',
        }
      : {
          id: speakData.id,
          type: Platform.Common.Voice.Models.Prompt.PromptType.TEXT,
          voice: speakData.voice,
          content: speakData.content,
        }
);
