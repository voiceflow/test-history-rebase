import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/chat-types';
import { Constants } from '@voiceflow/general-types';

import { baseInteractionAdapter } from '../base';
import { chatMigrateRepromptToNoReply, chatNoMatchAdapter, chatNoReplyAdapter, chipsToIntentButtons, createBlockAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
  ({ else: elseData, reprompt, chips, noReply, buttons, ...baseData }) => {
    const migratedNoReply = chatMigrateRepromptToNoReply(noReply, reprompt);

    return {
      ...baseInteractionAdapter.fromDB(baseData, { platform: Constants.PlatformType.GENERAL }),

      else: chatNoMatchAdapter.fromDB(elseData),
      buttons: buttons ?? chipsToIntentButtons(chips),
      noReply: migratedNoReply && chatNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ else: elseData, noReply, buttons, ...baseData }) => ({
    ...baseInteractionAdapter.toDB(baseData, { platform: Constants.PlatformType.GENERAL }),

    else: chatNoMatchAdapter.toDB(elseData as NodeData.ChatNoMatch),
    chips: null,
    buttons,
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as Node.Utils.StepNoReply),
  })
);

export default interactionAdapter;
