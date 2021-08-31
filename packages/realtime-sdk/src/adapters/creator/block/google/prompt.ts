import { Node } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { chipsToIntentButtons, createBlockAdapter, voiceNoMatchAdapter, voiceRepromptAdapter } from '../utils';

const promptAdapter = createBlockAdapter<Node.Prompt.StepData, NodeData.Prompt>(
  ({ reprompt, noMatches, chips, buttons }) => ({
    reprompt: reprompt && voiceRepromptAdapter.fromDB(reprompt),
    noMatchReprompt: voiceNoMatchAdapter.fromDB(noMatches),
    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ reprompt, noMatchReprompt, buttons }) => ({
    ports: [],
    reprompt: reprompt && voiceRepromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
    noMatches: voiceNoMatchAdapter.toDB(noMatchReprompt as NodeData.VoiceNoMatches),
    chips: null,
    buttons,
  })
);

export default promptAdapter;
