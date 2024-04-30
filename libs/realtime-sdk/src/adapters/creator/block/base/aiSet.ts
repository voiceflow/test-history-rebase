import type { BaseNode } from '@voiceflow/base-types';

import type { NodeData } from '@/models';

import { createBlockAdapter, createOutPortsAdapterV2, nextOnlyOutPortsAdapterV2 } from '../utils';

const aiSetAdapter = createBlockAdapter<BaseNode.AISet.StepData, NodeData.AISet>(
  (data) => data,
  (data) => data
);

export const aiSetOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.AISetBuiltInPorts, NodeData.AISet>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default aiSetAdapter;
