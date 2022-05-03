import { NodeData } from '@realtime-sdk/models';
import { AnyRecord, BaseNode } from '@voiceflow/base-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  dynamicOnlyOutPortsAdapter,
  dynamicOnlyOutPortsAdapterV2,
} from '../utils';

const randomAdapter = createBlockAdapter<BaseNode.Random.StepData, NodeData.Random>(
  ({ paths, noDuplicates }) => ({ paths, noDuplicates }),
  ({ paths, noDuplicates }) => ({ paths, noDuplicates })
);

export const randomOutPortsAdapter = createOutPortsAdapter<AnyRecord, NodeData.Random>(
  (ports, options) => dynamicOnlyOutPortsAdapter.fromDB(ports, options),
  (ports, options) => dynamicOnlyOutPortsAdapter.toDB(ports, options)
);

export const randomOutPortsAdapterV2 = createOutPortsAdapterV2<AnyRecord, NodeData.Random>(
  (ports, options) => dynamicOnlyOutPortsAdapterV2.fromDB(ports, options),
  (ports, options) => dynamicOnlyOutPortsAdapterV2.toDB(ports, options)
);

export default randomAdapter;
