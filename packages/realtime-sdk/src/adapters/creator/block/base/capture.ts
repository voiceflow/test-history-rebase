import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, createOutPortsAdapter, nextNoMatchNoReplyOutPortsAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Omit<Node.Capture.StepData, 'reprompt' | 'noReply'>, Omit<NodeData.Capture, 'buttons' | 'noReply'>>(
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

export const captureOutPortsAdapter = createOutPortsAdapter<NodeData.CaptureBuiltInPorts, NodeData.Capture>(
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapter.toDB(dbPorts, options)
);

export default captureAdapter;
