import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, createOutPortsAdapterV2, nextNoMatchNoReplyOutPortsAdapterV2 } from '../utils';

const aiResponseAdapter = createBlockAdapter<BaseNode.AIResponse.StepData, NodeData.AIResponse>(
  (data) => data,
  (data) => data
);

// it is not possible for there to be V1 ports for aiResponse step

export const aiResponseOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.AIResponseBuiltInPorts, NodeData.AIResponse>(
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default aiResponseAdapter;
