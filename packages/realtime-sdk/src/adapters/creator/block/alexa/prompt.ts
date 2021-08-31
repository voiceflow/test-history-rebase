import { Node } from '@voiceflow/alexa-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, voiceNoMatchAdapter, voiceRepromptAdapter } from '../utils';

const promptAdapter = createBlockAdapter<Node.Prompt.StepData, NodeData.Prompt>(
  ({ reprompt, noMatches }) => ({
    reprompt: reprompt && voiceRepromptAdapter.fromDB(reprompt),
    noMatchReprompt: voiceNoMatchAdapter.fromDB(noMatches),
    buttons: null, // no buttons on alexa
  }),
  ({ reprompt, noMatchReprompt }) => ({
    ports: [],
    reprompt: reprompt && voiceRepromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
    noMatches: voiceNoMatchAdapter.toDB(noMatchReprompt as NodeData.VoiceNoMatches),
    chips: null,
    buttons: null,
  })
);

export default promptAdapter;
