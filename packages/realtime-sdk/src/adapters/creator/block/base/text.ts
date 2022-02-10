import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, createOutPortsAdapter, nextOnlyOutPortsAdapter } from '../utils';

const textAdapter = createBlockAdapter<BaseNode.Text.StepData, NodeData.Text>(
  (data) => data,
  (data) => data
);

export const textOutPortsAdapter = createOutPortsAdapter<NodeData.TextBuiltInPorts, NodeData.Text>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export default textAdapter;
