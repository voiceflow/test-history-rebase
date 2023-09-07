import { BaseNode, Nullable } from '@voiceflow/base-types';
import { ChatModels, ChatNode } from '@voiceflow/chat-types';
import { Nullish } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config/backend';
import { VoiceModels, VoiceNode } from '@voiceflow/voice-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import { NodeData } from '../../../../models';

export const baseNoReplyAdapter = createMultiAdapter<BaseNode.Utils.BaseStepNoReply, BaseNode.Utils.BaseStepNoReply>(
  ({ types, timeout, pathName, randomize }) => ({ types, timeout, pathName, randomize }),
  ({ types, timeout, pathName, randomize }) => ({ types, timeout, pathName, randomize })
);

export const chatNoReplyAdapter = createMultiAdapter<ChatNode.Utils.StepNoReply, ChatNode.Utils.StepNoReply>(
  ({ reprompts, ...baseNoReply }) => ({
    ...baseNoReplyAdapter.fromDB(baseNoReply),
    reprompts: reprompts ? Platform.Common.Chat.CONFIG.adapters.prompt.simple.mapFromDB(reprompts) : undefined,
  }),
  ({ reprompts, ...baseNoReply }) => ({
    ...baseNoReplyAdapter.toDB(baseNoReply),
    reprompts: reprompts ? Platform.Common.Chat.CONFIG.adapters.prompt.simple.mapToDB(reprompts) : undefined,
  })
);

export const voiceNoReplyAdapter = createMultiAdapter<VoiceNode.Utils.StepNoReply<any>, NodeData.VoiceNoReply>(
  ({ reprompts, ...baseNoReply }) => ({
    ...baseNoReplyAdapter.fromDB(baseNoReply),
    reprompts: reprompts ? Platform.Common.Voice.CONFIG.adapters.prompt.simple.mapFromDB(reprompts) : undefined,
  }),
  ({ reprompts, ...baseNoReply }) => ({
    ...baseNoReplyAdapter.toDB(baseNoReply),
    reprompts: reprompts ? Platform.Common.Voice.CONFIG.adapters.prompt.simple.mapToDB(reprompts) : undefined,
  })
);

const migrateRepromptToNoReply = <T extends ChatNode.Utils.StepNoReply | VoiceNode.Utils.StepNoReply<any>>(
  noReply: Nullish<T>,
  reprompt: Nullable<NonNullable<T['reprompts']>[number]> = null
): Nullable<T> =>
  noReply ??
  (reprompt && noReply !== null // null means no reply was set to null by a user
    ? ({
        types: [BaseNode.Utils.NoReplyType.REPROMPT],
        randomize: false,
        reprompts: [reprompt],
      } as unknown as T)
    : null);

export const chatMigrateRepromptToNoReply = (
  noReply: Nullish<ChatNode.Utils.StepNoReply>,
  reprompt: Nullable<ChatModels.Prompt> = null
): Nullable<ChatNode.Utils.StepNoReply> => migrateRepromptToNoReply(noReply, reprompt);

export const voiceMigrateRepromptToNoReply = (
  noReply: Nullish<VoiceNode.Utils.StepNoReply<any>>,
  reprompt: Nullable<VoiceModels.Prompt<any>> = null
): Nullable<VoiceNode.Utils.StepNoReply<any>> => migrateRepromptToNoReply(noReply, reprompt);
