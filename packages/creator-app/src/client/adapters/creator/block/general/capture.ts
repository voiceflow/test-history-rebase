import { Voice } from '@voiceflow/general-types';
import { StepData } from '@voiceflow/general-types/build/nodes/capture';

import { NodeData } from '@/models';

import { createBlockAdapter, repromptAdapter } from '../utils';

const captureAdapter = createBlockAdapter<StepData<Voice>, NodeData.Capture>(
  ({ slot, variable, reprompt, slotInputs, chips = null }) => ({
    slot,
    variable,
    examples: slotInputs,
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    chips,
  }),
  ({ slot, variable, reprompt, examples, chips }) => ({
    slot,
    variable,
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    slotInputs: examples,
    chips,
  })
);

export default captureAdapter;
