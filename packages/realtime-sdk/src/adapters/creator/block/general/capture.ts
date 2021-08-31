import { Node } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { chipsToIntentButtons, createBlockAdapter, voiceRepromptAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Node.Capture.StepData, NodeData.Capture>(
  ({ slot, variable, reprompt, slotInputs, chips, buttons }) => ({
    slot,
    variable,
    examples: slotInputs,
    reprompt: reprompt && voiceRepromptAdapter.fromDB(reprompt),
    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ slot, variable, reprompt, examples, buttons }) => ({
    slot,
    variable,
    reprompt: reprompt && voiceRepromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
    slotInputs: examples,
    chips: null,
    buttons,
  })
);

export default captureAdapter;
