import { NoMatches, Prompt, Voice } from '@voiceflow/alexa-types';

import { createAdapter, createSimpleAdapter } from '@/client/adapters/utils';
import { DialogType, RepromptType, SLOT_REGEXP, VARIABLE_STRING_REGEXP } from '@/constants';
import { NodeData } from '@/models';
import { SpeakData } from '@/models/Speak';

export const createBlockAdapter = createSimpleAdapter;

// TODO: refactor merge repromptAdapter and noMatchRepromptAdapter to use the same types
export const repromptAdapter = createAdapter<Prompt, NodeData.Reprompt>(
  (reprompt) => {
    const type = reprompt.voice === Voice.AUDIO ? RepromptType.AUDIO : RepromptType.TEXT;

    return {
      type,
      voice: type === RepromptType.TEXT ? reprompt.voice : null,
      audio: type === RepromptType.TEXT ? null : reprompt.content,
      content: type === RepromptType.TEXT ? reprompt.content : '',
    };
  },
  (reprompt) => ({
    voice: reprompt.type === RepromptType.AUDIO ? Voice.AUDIO : (reprompt.voice as Voice | undefined) ?? Voice.ALEXA,
    content: (reprompt.type === RepromptType.AUDIO ? reprompt.audio : reprompt.content) ?? '',
  })
);

export const noMatchRepromptAdapter = createAdapter<Prompt, SpeakData>(
  (reprompt) =>
    reprompt.voice === Voice.AUDIO
      ? { url: reprompt.content, type: DialogType.AUDIO }
      : { type: DialogType.VOICE, voice: reprompt.voice, content: reprompt.content },
  (reprompt) => ({
    voice: reprompt.type === DialogType.AUDIO ? Voice.AUDIO : (reprompt.voice as Voice | undefined) ?? Voice.ALEXA,
    content: reprompt.type === DialogType.AUDIO ? reprompt.url : reprompt.content,
  })
);

export const noMatchAdapter = createAdapter<NoMatches, NodeData.NoMatches>(
  ({ randomize, reprompts }) => ({
    randomize,
    reprompts: noMatchRepromptAdapter.mapFromDB(reprompts),
  }),
  ({ randomize, reprompts }) => ({
    randomize,
    reprompts: noMatchRepromptAdapter.mapToDB(reprompts),
  })
);

export const transformVariablesToReadable = (text: string) => text.replace(SLOT_REGEXP, '{$1}').trim();
export const transformVariablesFromReadableWithoutTrim = (text: string) => text.replace(VARIABLE_STRING_REGEXP, '{{[$1].$1}}');
export const transformVariablesFromReadable = (text: string) => transformVariablesFromReadableWithoutTrim(text).trim();
