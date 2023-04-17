import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextAndFailOnlyOutPortsAdapter,
  nextAndFailOnlyOutPortsAdapterV2,
} from '../utils';

const codeAdapter = createBlockAdapter<BaseNode.Code.StepData, NodeData.Code>(
  ({ code }) => ({ code }),
  ({ code }) => ({ code })
);

export const codeOutPortsAdapter = createOutPortsAdapter<NodeData.CodeBuiltInPorts, NodeData.Code>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const codeOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.CodeBuiltInPorts, NodeData.Code>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default codeAdapter;
