import type { StepData } from '@voiceflow/alexa-types/build/nodes/capture';

import { NodeData } from '@/models';

import { createBlockAdapter, repromptAdapter } from './utils';

const captureBlockAdapter = createBlockAdapter<StepData, NodeData.Capture>(
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

export default captureBlockAdapter;
