import type { NodeData } from '@realtime-sdk/models';
import type { ChatNode } from '@voiceflow/chat-types';

import { basePromptAdapter } from '../base';
import {
  chatMigrateRepromptToNoReply,
  chatNoMatchAdapter,
  chatNoReplyAdapter,
  chipsToIntentButtons,
  createBlockAdapter,
  fallbackNoMatch,
} from '../utils';

const promptAdapter = createBlockAdapter<ChatNode.Prompt.StepData, NodeData.Prompt>(
  ({ reprompt, noMatches, chips, buttons, noReply, noMatch, ...baseData }, options) => {
    const migratedNoReply = chatMigrateRepromptToNoReply(noReply, reprompt);
    const noMatchWithFallback = fallbackNoMatch(noMatch, noMatches);

    return {
      ...basePromptAdapter.fromDB(baseData, options),

      buttons: buttons ?? chipsToIntentButtons(chips),
      noReply: migratedNoReply && chatNoReplyAdapter.fromDB(migratedNoReply),
      noMatch: noMatchWithFallback && chatNoMatchAdapter.fromDB(noMatchWithFallback),
    };
  },
  ({ noReply, noMatch, buttons, ...baseData }, options) => ({
    ...basePromptAdapter.toDB(baseData, options),

    chips: null,
    buttons,
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
    noMatch: noMatch && chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatch),
  })
);

export default promptAdapter;
