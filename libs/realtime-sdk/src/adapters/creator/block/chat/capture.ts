import { NodeData } from '@realtime-sdk/models';
import { ChatNode } from '@voiceflow/chat-types';

import { baseCaptureAdapter } from '../base';
import { chatMigrateRepromptToNoReply, chatNoReplyAdapter, chipsToIntentButtons, createBlockAdapter } from '../utils';

const captureAdapter = createBlockAdapter<ChatNode.Capture.StepData, NodeData.Capture>(
  ({ chips, reprompt, noReply, buttons, ...baseData }, options) => {
    const migratedNoReply = chatMigrateRepromptToNoReply(noReply, reprompt);

    return {
      ...baseCaptureAdapter.fromDB(baseData, options),

      buttons: buttons ?? chipsToIntentButtons(chips),
      noReply: migratedNoReply && chatNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ buttons, noReply, ...baseData }, options) => ({
    ...baseCaptureAdapter.toDB(baseData, options),

    chips: null,
    buttons,
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
  })
);

export default captureAdapter;
