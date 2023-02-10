import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, createOutPortsAdapterV2, nextOnlyOutPortsAdapterV2 } from '../utils';

const generativeAdapter = createBlockAdapter<BaseNode.Generative.StepData, NodeData.Generative>(
  (data) => data,
  (data) => data
);

// it is not possible for there to be V1 ports for generative step

export const generativeOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.GenerativeBuiltInPorts, NodeData.Generative>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default generativeAdapter;
