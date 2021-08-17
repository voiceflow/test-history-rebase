import { Node } from '@voiceflow/alexa-types';

import { NodeData } from '@/models';

import { createBlockAdapter, noMatchAdapter, repromptAdapter } from '../utils';

const promptAdapter = createBlockAdapter<Node.Prompt.StepData, NodeData.Prompt>(
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
