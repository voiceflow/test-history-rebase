import { BaseNode, Nullable } from '@voiceflow/base-types';
import { ChatNode } from '@voiceflow/chat-types';
import { Nullish } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { VoiceNode } from '@voiceflow/voice-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import { NodeData } from '../../../../models';

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
    reprompts: Platform.Common.Chat.CONFIG.adapters.prompt.simple.mapFromDB(reprompts),
  }),
  ({ reprompts, ...baseNoMatch }) => ({
    ...baseNoMatchAdapter.toDB(baseNoMatch),
    reprompts: Platform.Common.Chat.CONFIG.adapters.prompt.simple.mapToDB(reprompts as Platform.Common.Chat.Models.Prompt.Model[]),
  })
);

export const voiceNoMatchAdapter = createMultiAdapter<VoiceNode.Utils.StepNoMatch<any>, NodeData.VoiceNoMatch>(
  ({ reprompts = [], ...baseNoMatch }) => ({
    ...baseNoMatchAdapter.fromDB(baseNoMatch),
    reprompts: Platform.Common.Voice.CONFIG.adapters.prompt.simple.mapFromDB(reprompts),
  }),
  ({ reprompts, ...baseNoMatch }) => ({
    ...baseNoMatchAdapter.toDB(baseNoMatch),
    reprompts: Platform.Common.Voice.CONFIG.adapters.prompt.simple.mapToDB(reprompts as Platform.Common.Voice.Models.Prompt.Model[]),
  })
);

export const fallbackNoMatch = <T extends ChatNode.Utils.StepNoMatch | VoiceNode.Utils.StepNoMatch<any>>(
  noMatch: Nullish<T>,
  deprecatedNoMatch: Nullish<T>
): Nullable<T> => (noMatch === undefined ? deprecatedNoMatch : noMatch) ?? null;
