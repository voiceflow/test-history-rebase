import type { NodeData } from '@realtime-sdk/models';
import type { BaseNode } from '@voiceflow/base-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextOnlyOutPortsAdapter,
  nextOnlyOutPortsAdapterV2,
} from '../utils';

const textAdapter = createBlockAdapter<BaseNode.Text.StepData, NodeData.Text>(
  (data) => data,
  (data) => data
);

export const textOutPortsAdapter = createOutPortsAdapter<NodeData.TextBuiltInPorts, NodeData.Text>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const textOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.TextBuiltInPorts, NodeData.Text>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default textAdapter;
