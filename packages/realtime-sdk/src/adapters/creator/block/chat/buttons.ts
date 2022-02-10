import { NodeData } from '@realtime-sdk/models';
import { ChatNode } from '@voiceflow/chat-types';

import { baseButtonsAdapter } from '../base';
import { chatMigrateRepromptToNoReply, chatNoMatchAdapter, chatNoReplyAdapter, createBlockAdapter } from '../utils';

const buttonsAdapter = createBlockAdapter<ChatNode.Buttons.StepData, NodeData.Buttons>(
  ({ else: noMatch, reprompt, noReply, ...baseData }) => {
    const migratedNoReply = chatMigrateRepromptToNoReply(noReply, reprompt);

    return {
      ...baseButtonsAdapter.fromDB(baseData),

      else: chatNoMatchAdapter.fromDB(noMatch),
      noReply: migratedNoReply && chatNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ else: noMatch, noReply, ...baseData }) => ({
    ...baseButtonsAdapter.toDB(baseData),

    else: chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatch),
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
  })
);

export default buttonsAdapter;
