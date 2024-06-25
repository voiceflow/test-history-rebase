import type { NodeData } from '@realtime-sdk/models';
import type { BaseNode } from '@voiceflow/base-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextOnlyOutPortsAdapter,
  nextOnlyOutPortsAdapterV2,
} from '../utils';

const visualAdapter = createBlockAdapter<BaseNode.Visual.StepData, NodeData.Visual>(
  (data) => data,
  (data) => data
);

export const visualOutPortsAdapter = createOutPortsAdapter<NodeData.VisualBuiltInPorts, NodeData.Visual>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const visualOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.VisualBuiltInPorts, NodeData.Visual>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default visualAdapter;
