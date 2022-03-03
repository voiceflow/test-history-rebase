import { NodeData } from '@realtime-sdk/models';
import { ChatNode } from '@voiceflow/chat-types';

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
  ({ reprompt, noMatches, chips, buttons, noReply, noMatch, ...baseData }) => {
    const migratedNoReply = chatMigrateRepromptToNoReply(noReply, reprompt);
    const noMatchWithFallback = fallbackNoMatch(noMatch, noMatches);

    return {
      ...basePromptAdapter.fromDB(baseData),

      buttons: buttons ?? chipsToIntentButtons(chips),
      noReply: migratedNoReply && chatNoReplyAdapter.fromDB(migratedNoReply),
      noMatch: noMatchWithFallback && chatNoMatchAdapter.fromDB(noMatchWithFallback),
    };
  },
  ({ noReply, noMatch, buttons, ...baseData }) => ({
    ...basePromptAdapter.toDB(baseData),

    chips: null,
    buttons,
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
    noMatch: noMatch && chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatch),
  })
);

export default promptAdapter;
