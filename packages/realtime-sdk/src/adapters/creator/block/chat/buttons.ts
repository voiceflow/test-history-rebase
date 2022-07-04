import { NodeData } from '@realtime-sdk/models';
import { ChatNode } from '@voiceflow/chat-types';

import { baseButtonsAdapter } from '../base';
import { chatMigrateRepromptToNoReply, chatNoMatchAdapter, chatNoReplyAdapter, createBlockAdapter, fallbackNoMatch } from '../utils';

const buttonsAdapter = createBlockAdapter<ChatNode.Buttons.StepData, NodeData.Buttons>(
  ({ else: elseData, reprompt, noReply, noMatch, ...baseData }, options) => {
    const migratedNoReply = chatMigrateRepromptToNoReply(noReply, reprompt);
    const noMatchWithFallback = fallbackNoMatch(noMatch, elseData);

    return {
      ...baseButtonsAdapter.fromDB(baseData, options),

      noMatch: noMatchWithFallback && chatNoMatchAdapter.fromDB(noMatchWithFallback),
      noReply: migratedNoReply && chatNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ noMatch, noReply, ...baseData }, options) => ({
    ...baseButtonsAdapter.toDB(baseData, options),

    noMatch: chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatch),
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
  })
);

export default buttonsAdapter;
