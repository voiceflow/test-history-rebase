import type { StepData } from '@voiceflow/google-types/build/nodes/prompt';

import { NodeData } from '@/models';

import { createBlockAdapter, noMatchAdapter, repromptAdapter } from './utils';

const promptAdapter = createBlockAdapter<StepData, NodeData.Prompt>(
  ({ reprompt, noMatches }) => ({
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    noMatchReprompt: noMatchAdapter.fromDB(noMatches),
  }),
  ({ reprompt, noMatchReprompt }) => ({
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    noMatches: noMatchAdapter.toDB(noMatchReprompt),
    ports: [],
  })
);

export default promptAdapter;
