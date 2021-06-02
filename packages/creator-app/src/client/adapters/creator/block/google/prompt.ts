import { StepData } from '@voiceflow/general-types/build/nodes/prompt';
import { Voice } from '@voiceflow/google-types';

import { NodeData } from '@/models';

import { createBlockAdapter, noMatchAdapter, repromptAdapter } from '../utils';

const promptAdapter = createBlockAdapter<StepData<Voice>, NodeData.Prompt>(
  ({ reprompt, noMatches, chips = null }) => ({
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    noMatchReprompt: noMatchAdapter.fromDB(noMatches),
    chips,
  }),
  ({ reprompt, noMatchReprompt, chips }) => ({
    ports: [],
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    noMatches: noMatchAdapter.toDB(noMatchReprompt),
    chips,
  })
);

export default promptAdapter;
