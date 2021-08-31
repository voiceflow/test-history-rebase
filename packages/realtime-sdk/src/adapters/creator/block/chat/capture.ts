import { Node, Types } from '@voiceflow/chat-types';

import { NodeData } from '../../../../models';
import { chatRepromptAdapter } from '../../../utils';
import { chipsToIntentButtons, createBlockAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Node.Capture.StepData, NodeData.Capture>(
  ({ slot, variable, reprompt, slotInputs, chips, buttons }) => ({
    slot,
    buttons: buttons ?? chipsToIntentButtons(chips),
    variable,
    reprompt: reprompt && chatRepromptAdapter.fromDB(reprompt),
    examples: slotInputs,
  }),
  ({ slot, variable, reprompt, examples, buttons }) => ({
    slot,
    chips: null,
    buttons,
    variable,
    reprompt: reprompt && chatRepromptAdapter.toDB(reprompt as Types.Prompt),
    slotInputs: examples,
  })
);

export default captureAdapter;
