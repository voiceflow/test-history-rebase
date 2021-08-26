import { Node } from '@voiceflow/general-types';

import { NodeData } from '@/models';

import { createBlockAdapter, noMatchAdapter, repromptAdapter } from '../utils';

const buttonsAdapter = createBlockAdapter<Node.Buttons.StepData, NodeData.Buttons>(
  ({ else: noMatch, reprompt, ...data }) => ({
    ...data,
    else: noMatchAdapter.fromDB(noMatch),
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
  }),
  ({ else: noMatch, reprompt, ...data }) => ({
    ...data,
    else: noMatchAdapter.toDB(noMatch),
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
  })
);

export default buttonsAdapter;
