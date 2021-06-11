import { StepData } from '@voiceflow/general-types/build/nodes/prompt';
import { Voice } from '@voiceflow/google-types';

import { NodeData } from '@/models';

import { chipsToIntentButtons, createBlockAdapter, noMatchAdapter, repromptAdapter } from '../utils';

const promptAdapter = createBlockAdapter<StepData<Voice>, NodeData.Prompt>(
  ({ reprompt, noMatches, chips, buttons }) => ({
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    noMatchReprompt: noMatchAdapter.fromDB(noMatches),
    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ reprompt, noMatchReprompt, buttons }) => ({
    ports: [],
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    noMatches: noMatchAdapter.toDB(noMatchReprompt),
    chips: null,
    buttons,
  })
);

export default promptAdapter;
