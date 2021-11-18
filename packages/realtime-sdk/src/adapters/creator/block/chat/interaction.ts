import { NodeData } from '@realtime-sdk/models';
import { Node, Types } from '@voiceflow/chat-types';
import { Constants } from '@voiceflow/general-types';

import { baseInteractionAdapter } from '../base';
import { chatNoMatchAdapter, chatPromptAdapter, chipsToIntentButtons, createBlockAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
  ({ else: elseData, reprompt, chips, buttons, ...baseData }) => ({
    ...baseInteractionAdapter.fromDB(baseData, { platform: Constants.PlatformType.GENERAL }),

    else: chatNoMatchAdapter.fromDB(elseData),
    buttons: buttons ?? chipsToIntentButtons(chips),
    reprompt: reprompt && chatPromptAdapter.fromDB(reprompt),
  }),
  ({ else: elseData, reprompt, buttons, ...baseData }) => ({
    ...baseInteractionAdapter.toDB(baseData, { platform: Constants.PlatformType.GENERAL }),

    else: chatNoMatchAdapter.toDB(elseData as NodeData.ChatNoMatch),
    chips: null,
    buttons,
    reprompt: reprompt && chatPromptAdapter.toDB(reprompt as Types.Prompt),
  })
);

export default interactionAdapter;
