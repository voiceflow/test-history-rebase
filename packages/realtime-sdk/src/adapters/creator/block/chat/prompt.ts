import { Node, Types } from '@voiceflow/chat-types';

import { NodeData } from '../../../../models';
import { chatRepromptAdapter } from '../../../utils';
import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { chatNoMatchAdapter } from './utils';

const promptAdapter = createBlockAdapter<Node.Prompt.StepData, NodeData.Prompt>(
  ({ reprompt, noMatches, chips, buttons }) => ({
    buttons: buttons ?? chipsToIntentButtons(chips),
    reprompt: reprompt && chatRepromptAdapter.fromDB(reprompt),
    noMatchReprompt: chatNoMatchAdapter.fromDB(noMatches),
  }),
  ({ reprompt, noMatchReprompt, buttons }) => ({
    ports: [],
    chips: null,
    buttons,
    reprompt: reprompt && chatRepromptAdapter.toDB(reprompt as Types.Prompt),
    noMatches: chatNoMatchAdapter.toDB(noMatchReprompt as NodeData.ChatNoMatches),
  })
);

export default promptAdapter;
