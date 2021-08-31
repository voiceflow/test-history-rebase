import { Node } from '@voiceflow/alexa-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, voiceRepromptAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Node.Capture.StepData, NodeData.Capture>(
  ({ slot, variable, reprompt, slotInputs }) => ({
    slot,
    variable,
    examples: slotInputs,
    reprompt: reprompt && voiceRepromptAdapter.fromDB(reprompt),
    buttons: null, // no buttons on alexa
  }),
  ({ slot, variable, reprompt, examples }) => ({
    slot,
    variable,
    reprompt: reprompt && voiceRepromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
    slotInputs: examples,
    chips: null,
    buttons: null,
  })
);

export default captureAdapter;
