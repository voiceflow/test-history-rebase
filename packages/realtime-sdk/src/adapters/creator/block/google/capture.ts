import { Node } from '@voiceflow/google-types';

import { NodeData } from '../../../../models';
import { chipsToIntentButtons, createBlockAdapter, repromptAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Node.Capture.StepData, NodeData.Capture>(
  ({ slot, variable, reprompt, slotInputs, chips, buttons }) => ({
    slot,
    variable,
    examples: slotInputs,
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ slot, variable, reprompt, examples, buttons }) => ({
    slot,
    variable,
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    slotInputs: examples,
    chips: null,
    buttons,
  })
);

export default captureAdapter;
