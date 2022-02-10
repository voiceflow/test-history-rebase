import { NodeData } from '@realtime-sdk/models';
import { ChatNode } from '@voiceflow/chat-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { baseInteractionAdapter } from '../base';
import { chatMigrateRepromptToNoReply, chatNoMatchAdapter, chatNoReplyAdapter, chipsToIntentButtons, createBlockAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<ChatNode.Interaction.StepData, NodeData.Interaction>(
  ({ else: elseData, reprompt, chips, noReply, buttons, ...baseData }) => {
    const migratedNoReply = chatMigrateRepromptToNoReply(noReply, reprompt);

    return {
      ...baseInteractionAdapter.fromDB(baseData, { platform: VoiceflowConstants.PlatformType.GENERAL }),

      else: chatNoMatchAdapter.fromDB(elseData),
      buttons: buttons ?? chipsToIntentButtons(chips),
      noReply: migratedNoReply && chatNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ else: elseData, noReply, buttons, ...baseData }) => ({
    ...baseInteractionAdapter.toDB(baseData, { platform: VoiceflowConstants.PlatformType.GENERAL }),

    else: chatNoMatchAdapter.toDB(elseData as NodeData.ChatNoMatch),
    chips: null,
    buttons,
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
  })
);

export default interactionAdapter;
