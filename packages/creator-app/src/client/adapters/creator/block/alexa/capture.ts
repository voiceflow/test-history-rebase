import { Node } from '@voiceflow/alexa-types';

import { NodeData } from '@/models';

import { createBlockAdapter, repromptAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Node.Capture.StepData, NodeData.Capture>(
  ({ slot, variable, reprompt, slotInputs }) => ({
    slot,
    variable,
    examples: slotInputs,
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    buttons: null, // no buttons on alexa
  }),
  ({ slot, variable, reprompt, examples }) => ({
    slot,
    variable,
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    slotInputs: examples,
    chips: null,
    buttons: null,
  })
);

export default captureAdapter;
