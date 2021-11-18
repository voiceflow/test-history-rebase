import { NodeData } from '@realtime-sdk/models';
import { Node, Types } from '@voiceflow/chat-types';

import { basePromptAdapter } from '../base';
import { chatNoMatchAdapter, chatPromptAdapter, chipsToIntentButtons, createBlockAdapter } from '../utils';

const promptAdapter = createBlockAdapter<Node.Prompt.StepData, NodeData.Prompt>(
  ({ reprompt, noMatches, chips, buttons, ...baseData }) => ({
    ...basePromptAdapter.fromDB(baseData),

    buttons: buttons ?? chipsToIntentButtons(chips),
    reprompt: reprompt && chatPromptAdapter.fromDB(reprompt),
    noMatchReprompt: chatNoMatchAdapter.fromDB(noMatches),
  }),
  ({ reprompt, noMatchReprompt, buttons, ...baseData }) => ({
    ...basePromptAdapter.toDB(baseData),

    chips: null,
    buttons,
    reprompt: reprompt && chatPromptAdapter.toDB(reprompt as Types.Prompt),
    noMatches: chatNoMatchAdapter.toDB(noMatchReprompt as NodeData.ChatNoMatch),
  })
);

export default promptAdapter;
