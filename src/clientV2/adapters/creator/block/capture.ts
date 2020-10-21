import type { StepData } from '@voiceflow/general-types/build/nodes/capture';

import { NodeData } from '@/models';

import { createBlockAdapter, repromptAdapter } from './utils';

const captureAdapter = createBlockAdapter<StepData<any>, NodeData.Capture>(
  ({ slot, variable, reprompt, slotInputs }) => ({
    slot,
    variable,
    examples: slotInputs,
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
  }),
  ({ slot, variable, reprompt, examples }) => ({
    slot,
    variable,
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    slotInputs: examples,
  })
);

export default captureAdapter;
