import { BaseNode, Nullable } from '@voiceflow/base-types';
import { ChatNode } from '@voiceflow/chat-types';
import { Nullish } from '@voiceflow/common';
import { VoiceNode } from '@voiceflow/voice-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import { NodeData } from '../../../../models';
import { chatPromptAdapter, voicePromptAdapter } from './prompt';

export const baseNoMatchAdapter = createMultiAdapter<BaseNode.Utils.BaseStepNoMatch, NodeData.BaseNoMatch>(
  ({ type = BaseNode.Utils.NoMatchType.REPROMPT, types, pathName = 'No match', randomize }) => ({
    types:
      types ??
      (type === BaseNode.Utils.NoMatchType.BOTH
        ? [BaseNode.Utils.NoMatchType.PATH, BaseNode.Utils.NoMatchType.REPROMPT]
        : [type ?? BaseNode.Utils.NoMatchType.REPROMPT]),
    pathName,
    randomize,
  }),
  ({ types, randomize, pathName }) => ({ types, pathName, randomize })
);

export const chatNoMatchAdapter = createMultiAdapter<ChatNode.Utils.StepNoMatch, NodeData.ChatNoMatch>(
  ({ reprompts = [], ...baseNoMatch }) => ({
    ...baseNoMatchAdapter.fromDB(baseNoMatch),
    reprompts: chatPromptAdapter.mapFromDB(reprompts),
  }),
  ({ reprompts, ...baseNoMatch }) => ({
    ...baseNoMatchAdapter.toDB(baseNoMatch),
    reprompts: chatPromptAdapter.mapToDB(reprompts),
  })
);

export const voiceNoMatchAdapter = createMultiAdapter<VoiceNode.Utils.StepNoMatch<any>, NodeData.VoiceNoMatch>(
  ({ reprompts = [], ...baseNoMatch }) => ({
    ...baseNoMatchAdapter.fromDB(baseNoMatch),
    reprompts: voicePromptAdapter.mapFromDB(reprompts),
  }),
  ({ reprompts, ...baseNoMatch }) => ({
    ...baseNoMatchAdapter.toDB(baseNoMatch),
    reprompts: voicePromptAdapter.mapToDB(reprompts),
  })
);

export const fallbackNoMatch = <T extends ChatNode.Utils.StepNoMatch | VoiceNode.Utils.StepNoMatch<any>>(
  noMatch: Nullish<T>,
  deprecatedNoMatch: Nullish<T>
): Nullable<T> => (noMatch === undefined ? deprecatedNoMatch : noMatch) ?? null;
