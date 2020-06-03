import { DBNodeData, NodeData } from '@/models';

import { noMatchAdapter } from './interaction';
import { createBlockAdapter, repromptAdapter } from './utils';

const promptBlockAdapter = createBlockAdapter(
  ({ noMatchReprompt, reprompt }: DBNodeData.Prompt) => ({
    noMatchReprompt: noMatchAdapter.fromDB(noMatchReprompt),
    reprompt: repromptAdapter.fromDB(reprompt),
  }),
  ({ noMatchReprompt, reprompt }: NodeData.Prompt) => ({
    noMatchReprompt: noMatchAdapter.toDB(noMatchReprompt),
    reprompt: repromptAdapter.toDB(reprompt),
  })
);

export default promptBlockAdapter;
