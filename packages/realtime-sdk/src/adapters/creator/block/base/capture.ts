import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Omit<Node.Capture.StepData, 'reprompt'>, Omit<NodeData.Capture, 'reprompt' | 'buttons'>>(
  ({ slot, variable, slotInputs }) => ({
    slot,
    variable,
    examples: slotInputs,
  }),
  ({ slot, variable, examples }) => ({
    slot,
    chips: null,
    variable,
    slotInputs: examples,
  })
);

export default captureAdapter;
