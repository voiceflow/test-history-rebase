import { Voice } from '@voiceflow/alexa-types';
import { StepData } from '@voiceflow/general-types/build/nodes/prompt';

import { NodeData } from '@/models';

import { createBlockAdapter, noMatchAdapter, repromptAdapter } from '../utils';

const promptAdapter = createBlockAdapter<StepData<Voice>, NodeData.Prompt>(
  ({ reprompt, noMatches }) => ({
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    noMatchReprompt: noMatchAdapter.fromDB(noMatches),
    buttons: null, // no buttons on alexa
  }),
  ({ reprompt, noMatchReprompt }) => ({
    ports: [],
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    noMatches: noMatchAdapter.toDB(noMatchReprompt),
    chips: null,
    buttons: null,
  })
);

export default promptAdapter;
