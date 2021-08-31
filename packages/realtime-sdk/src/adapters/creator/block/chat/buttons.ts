import { Node, Types } from '@voiceflow/chat-types';

import { NodeData } from '../../../../models';
import { chatRepromptAdapter } from '../../../utils';
import { createBlockAdapter } from '../utils';
import { chatNoMatchAdapter } from './utils';

const buttonsAdapter = createBlockAdapter<Node.Buttons.StepData, NodeData.Buttons>(
  ({ else: noMatch, reprompt, ...data }) => ({
    ...data,
    else: chatNoMatchAdapter.fromDB(noMatch),
    reprompt: reprompt && chatRepromptAdapter.fromDB(reprompt),
  }),
  ({ else: noMatch, reprompt, ...data }) => ({
    ...data,
    else: chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatches),
    reprompt: reprompt && chatRepromptAdapter.toDB(reprompt as Types.Prompt),
  })
);

export default buttonsAdapter;
