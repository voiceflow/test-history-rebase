import { NodeData } from '@realtime-sdk/models';
import { ChatNode } from '@voiceflow/chat-types';

import { basePromptAdapter } from '../base';
import { chatMigrateRepromptToNoReply, chatNoMatchAdapter, chatNoReplyAdapter, chipsToIntentButtons, createBlockAdapter } from '../utils';

const promptAdapter = createBlockAdapter<ChatNode.Prompt.StepData, NodeData.Prompt>(
  ({ reprompt, noMatches, chips, buttons, noReply, ...baseData }) => {
    const migratedNoReply = chatMigrateRepromptToNoReply(noReply, reprompt);

    return {
      ...basePromptAdapter.fromDB(baseData),

      buttons: buttons ?? chipsToIntentButtons(chips),
      noReply: migratedNoReply && chatNoReplyAdapter.fromDB(migratedNoReply),
      noMatchReprompt: chatNoMatchAdapter.fromDB(noMatches),
    };
  },
  ({ noReply, noMatchReprompt, buttons, ...baseData }) => ({
    ...basePromptAdapter.toDB(baseData),

    chips: null,
    buttons,
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
    noMatches: chatNoMatchAdapter.toDB(noMatchReprompt as NodeData.ChatNoMatch),
  })
);

export default promptAdapter;
