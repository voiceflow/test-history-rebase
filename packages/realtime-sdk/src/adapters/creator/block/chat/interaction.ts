import { NodeData } from '@realtime-sdk/models';
import { ChatNode } from '@voiceflow/chat-types';

import { baseInteractionAdapter } from '../base';
import {
  chatMigrateRepromptToNoReply,
  chatNoMatchAdapter,
  chatNoReplyAdapter,
  chipsToIntentButtons,
  createBlockAdapter,
  fallbackNoMatch,
} from '../utils';

const interactionAdapter = createBlockAdapter<ChatNode.Interaction.StepData, NodeData.Interaction>(
  ({ else: elseData, reprompt, chips, noReply, noMatch, buttons, ...baseData }) => {
    const migratedNoReply = chatMigrateRepromptToNoReply(noReply, reprompt);
    const noMatchWithFallback = fallbackNoMatch(noMatch, elseData);

    return {
      ...baseInteractionAdapter.fromDB(baseData),

      buttons: buttons ?? chipsToIntentButtons(chips),
      noMatch: noMatchWithFallback && chatNoMatchAdapter.fromDB(noMatchWithFallback),
      noReply: migratedNoReply && chatNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ noReply, noMatch, buttons, ...baseData }) => ({
    ...baseInteractionAdapter.toDB(baseData),

    chips: null,
    buttons,
    noMatch: noMatch && chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatch),
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
  })
);

export default interactionAdapter;
