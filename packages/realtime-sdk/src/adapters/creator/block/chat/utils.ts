import { Node as BaseNode } from '@voiceflow/base-types';
import { Types as ChatTypes } from '@voiceflow/chat-types';

import { NodeData } from '../../../../models';
import { chatRepromptAdapter, createAdapter } from '../../../utils';

// eslint-disable-next-line import/prefer-default-export
export const chatNoMatchAdapter = createAdapter<BaseNode.Utils.StepNoMatch<ChatTypes.Prompt>, NodeData.ChatNoMatches>(
  ({ type = BaseNode.Utils.NoMatchType.REPROMPT, randomize, reprompts, pathName = 'No Match' }) => ({
    type,
    pathName,
    randomize,
    reprompts: chatRepromptAdapter.mapFromDB(reprompts),
  }),
  ({ type, randomize, reprompts, pathName }) => ({
    type,
    pathName,
    randomize,
    reprompts: chatRepromptAdapter.mapToDB(reprompts),
  })
);
