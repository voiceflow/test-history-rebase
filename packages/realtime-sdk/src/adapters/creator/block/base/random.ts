import { NodeData } from '@realtime-sdk/models';
import { AnyRecord, Node } from '@voiceflow/base-types';

import { createBlockAdapter, createOutPortsAdapter, dynamicOnlyOutPortsAdapter } from '../utils';

const randomAdapter = createBlockAdapter<Node.Random.StepData, NodeData.Random>(
  ({ paths, noDuplicates }) => ({ paths, noDuplicates }),
  ({ paths, noDuplicates }) => ({ paths, noDuplicates })
);

export const randomOutPortsAdapter = createOutPortsAdapter<AnyRecord, NodeData.Random>(
  (ports, options) => dynamicOnlyOutPortsAdapter.fromDB(ports, options),
  (ports, options) => dynamicOnlyOutPortsAdapter.toDB(ports, options)
);

export default randomAdapter;
