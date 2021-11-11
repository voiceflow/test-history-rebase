import { Constants as AlexaConstants } from '@voiceflow/alexa-types';
import { Types as ChatTypes } from '@voiceflow/chat-types';
import { Utils } from '@voiceflow/common';
import { Types as VoiceTypes } from '@voiceflow/voice-types';
import createAdapter from 'bidirectional-adapter';

import { DialogType, VoicePromptType } from '../../../../constants';
import { NodeData, SpeakData } from '../../../../models';

const createSlateText = (text = '') => [{ children: [{ text }] }];

export const chatPromptAdapter = createAdapter<ChatTypes.Prompt, ChatTypes.Prompt>(
  (prompt: VoiceTypes.Prompt<any> | VoiceTypes.IntentPrompt<any> | ChatTypes.Prompt) => {
    // migrate from old voice prompt types
    if ('text' in prompt) {
      if (!prompt.text) {
        return { id: Utils.id.cuid(), content: createSlateText() };
      }

      return { id: Utils.id.cuid(), content: createSlateText(prompt.text) };
    }

    if (!prompt.content) {
      return { id: Utils.id.cuid(), content: createSlateText() };
    }

    if (typeof prompt.content === 'string') {
      return { id: Utils.id.cuid(), content: createSlateText(prompt.content) };
    }

    return prompt as ChatTypes.Prompt;
  },
  (prompt) => prompt
);

export const voicePromptAdapter = createAdapter<VoiceTypes.Prompt<any>, NodeData.VoicePrompt>(
  (reprompt) => {
    const type = reprompt.voice === AlexaConstants.Voice.AUDIO ? VoicePromptType.AUDIO : VoicePromptType.TEXT;

    return {
      id: Utils.id.cuid.slug(),
      type,
      desc: reprompt.desc,
      voice: type === VoicePromptType.TEXT ? reprompt.voice : null,
      audio: type === VoicePromptType.TEXT ? null : reprompt.content,
      content: type === VoicePromptType.TEXT ? reprompt.content : '',
    };
  },
  (reprompt) => ({
    desc: reprompt.desc ?? undefined,
    voice:
      reprompt.type === VoicePromptType.AUDIO
        ? AlexaConstants.Voice.AUDIO
        : (reprompt.voice as AlexaConstants.Voice | undefined) ?? AlexaConstants.Voice.ALEXA,
    content: (reprompt.type === VoicePromptType.AUDIO ? reprompt.audio : reprompt.content) ?? '',
  })
);

export const voicePromptToSpeakDataAdapter = createAdapter<NodeData.VoicePrompt, SpeakData>(
  (reprompt) =>
    reprompt.type === VoicePromptType.AUDIO
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
          type: VoicePromptType.AUDIO,
          desc: speakData.desc,
          audio: speakData.url,
          content: '',
        }
      : {
          id: speakData.id,
          type: VoicePromptType.TEXT,
          voice: speakData.voice,
          content: speakData.content,
        }
);
