import { DialogType, RepromptType } from '../../constants';
import { NodeData, SpeakData } from '../../models';
import { createAdapter } from './adapter';

// eslint-disable-next-line import/prefer-default-export
export const voiceRepromptToSpeakDataAdapter = createAdapter<NodeData.VoicePrompt, SpeakData>(
  (reprompt) =>
    reprompt.type === RepromptType.AUDIO
      ? {
          id: reprompt.id,
          url: reprompt.audio ?? '',
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
          type: RepromptType.AUDIO,
          desc: speakData.desc,
          audio: speakData.url,
          content: '',
        }
      : {
          id: speakData.id,
          type: RepromptType.TEXT,
          voice: speakData.voice,
          content: speakData.content,
        }
);
