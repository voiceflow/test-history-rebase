import { Voice } from '@voiceflow/alexa-types';
import { DiagramNode as DBNode, Port as DBPort } from '@voiceflow/api-sdk';
import { NoMatches, Prompt } from '@voiceflow/general-types';

import { Adapter, Options, createAdapter, createSimpleAdapter } from '@/client/adapters/utils';
import { DialogType, PlatformType, RepromptType, SLOT_REGEXP, VARIABLE_STRING_REGEXP } from '@/constants';
import { Node, NodeData, Port } from '@/models';
import { SpeakData } from '@/models/Speak';

const PLATFORMS = Object.values(PlatformType);

export const createBlockAdapter = <I, O>(
  fromDB: Adapter<I, [{ platform: PlatformType }], O>,
  toDB: Adapter<O, [{ platform: PlatformType }], I>,
  options: Options = {}
) => createSimpleAdapter<I, O, [{ platform: PlatformType }], [{ platform: PlatformType }]>(fromDB, toDB, options);

export type PortsAdapter = {
  toDB: (ports: { port: Port; target: string | null }[], node: Node, platform: PlatformType) => DBPort[];
  fromDB: (ports: DBPort[], node: DBNode, platform: PlatformType) => { port: Port; target: string | null }[];
};

// TODO: refactor merge repromptAdapter and noMatchRepromptAdapter to use the same types
export const repromptAdapter = createAdapter<Prompt<any>, NodeData.Reprompt>(
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

export const noMatchRepromptAdapter = createAdapter<Prompt<any>, SpeakData>(
  (reprompt) =>
    reprompt.voice === Voice.AUDIO
      ? { url: reprompt.content, type: DialogType.AUDIO }
      : { type: DialogType.VOICE, voice: reprompt.voice, content: reprompt.content },
  (reprompt) => ({
    voice: reprompt.type === DialogType.AUDIO ? Voice.AUDIO : (reprompt.voice as Voice | undefined) ?? Voice.ALEXA,
    content: reprompt.type === DialogType.AUDIO ? reprompt.url : reprompt.content,
  })
);

export const noMatchAdapter = createAdapter<NoMatches<any>, NodeData.NoMatches>(
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

export const defaultPlatformsData = <T>(data: T) =>
  PLATFORMS.reduce<Record<PlatformType, T>>((acc, platform) => Object.assign(acc, { [platform]: data }), {} as Record<PlatformType, T>);
