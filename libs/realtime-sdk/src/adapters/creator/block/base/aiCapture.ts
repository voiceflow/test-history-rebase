import type { BaseNode } from '@voiceflow/base-types';

import type { NodeData } from '@/models';

import { createBlockAdapter, createOutPortsAdapterV2, nextNoMatchNoReplyOutPortsAdapterV2 } from '../utils';

const aiCaptureAdapter = createBlockAdapter<BaseNode.AICapture.StepData, NodeData.AICapture>(
  (data) => data,
  (data) => data
);

// it is not possible for there to be V1 ports for aiResponse step
export const aiCaptureOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.AICaptureBuiltInPorts, NodeData.AICapture>(
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default aiCaptureAdapter;
