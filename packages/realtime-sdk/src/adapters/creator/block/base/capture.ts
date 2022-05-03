import { BaseNode } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextNoMatchNoReplyOutPortsAdapter,
  nextNoMatchNoReplyOutPortsAdapterV2,
} from '../utils';

const captureAdapter = createBlockAdapter<Omit<BaseNode.Capture.StepData, 'reprompt' | 'noReply'>, Omit<NodeData.Capture, 'buttons' | 'noReply'>>(
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

export const captureOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.CaptureBuiltInPorts, NodeData.Capture>(
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default captureAdapter;
