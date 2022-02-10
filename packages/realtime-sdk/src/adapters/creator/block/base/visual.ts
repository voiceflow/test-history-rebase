import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, createOutPortsAdapter, nextOnlyOutPortsAdapter } from '../utils';

const visualAdapter = createBlockAdapter<BaseNode.Visual.StepData, NodeData.Visual>(
  (data) => data,
  (data) => data
);

export const visualOutPortsAdapter = createOutPortsAdapter<NodeData.VisualBuiltInPorts, NodeData.Visual>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export default visualAdapter;
