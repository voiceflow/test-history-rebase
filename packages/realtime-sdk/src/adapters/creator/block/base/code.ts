import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/base-types';

import { createBlockAdapter, createOutPortsAdapter, nextAndFailOnlyOutPortsAdapter } from '../utils';

const codeAdapter = createBlockAdapter<Node.Code.StepData, NodeData.Code>(
  ({ code }) => ({ code }),
  ({ code }) => ({ code })
);

export const codeOutPortsAdapter = createOutPortsAdapter<NodeData.CodeBuiltInPorts, NodeData.Code>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export default codeAdapter;
