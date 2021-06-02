import { Voice } from '@voiceflow/alexa-types';
import { StepData } from '@voiceflow/general-types/build/nodes/capture';

import { NodeData } from '@/models';

import { createBlockAdapter, repromptAdapter } from '../utils';

const captureAdapter = createBlockAdapter<StepData<Voice>, NodeData.Capture>(
  ({ slot, variable, reprompt, slotInputs }) => ({
    slot,
    variable,
    examples: slotInputs,
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    chips: null, // no chips on alexa
  }),
  ({ slot, variable, reprompt, examples }) => ({
    slot,
    variable,
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    slotInputs: examples,
    chips: null,
  })
);

export default captureAdapter;
