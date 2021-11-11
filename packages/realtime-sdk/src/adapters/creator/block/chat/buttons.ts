import { Node, Types } from '@voiceflow/chat-types';

import { NodeData } from '../../../../models';
import { baseButtonsAdapter } from '../base';
import { chatNoMatchAdapter, chatPromptAdapter, createBlockAdapter } from '../utils';

const buttonsAdapter = createBlockAdapter<Node.Buttons.StepData, NodeData.Buttons>(
  ({ else: noMatch, reprompt, ...baseData }) => ({
    ...baseButtonsAdapter.fromDB(baseData),

    else: chatNoMatchAdapter.fromDB(noMatch),
    reprompt: reprompt && chatPromptAdapter.fromDB(reprompt),
  }),
  ({ else: noMatch, reprompt, ...baseData }) => ({
    ...baseButtonsAdapter.toDB(baseData),

    else: chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatch),
    reprompt: reprompt && chatPromptAdapter.toDB(reprompt as Types.Prompt),
  })
);

export default buttonsAdapter;
