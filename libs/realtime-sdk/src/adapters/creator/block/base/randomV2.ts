import type { AnyRecord, BaseNode } from '@voiceflow/base-types';

import type { NodeData } from '@/models';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  dynamicOnlyOutPortsAdapter,
  dynamicOnlyOutPortsAdapterV2,
} from '../utils';

const randomV2Adapter = createBlockAdapter<BaseNode.RandomV2.StepData, NodeData.RandomV2>(
  ({ namedPaths, noDuplicates }) => ({ namedPaths, noDuplicates }),
  ({ namedPaths, noDuplicates }) => ({ namedPaths, noDuplicates })
);

export const randomV2OutPortsAdapter = createOutPortsAdapter<AnyRecord, NodeData.RandomV2>(
  (ports, options) => dynamicOnlyOutPortsAdapter.fromDB(ports, options),
  (ports, options) => dynamicOnlyOutPortsAdapter.toDB(ports, options)
);

export const randomV2OutPortsAdapterV2 = createOutPortsAdapterV2<AnyRecord, NodeData.RandomV2>(
  (ports, options) => dynamicOnlyOutPortsAdapterV2.fromDB(ports, options),
  (ports, options) => dynamicOnlyOutPortsAdapterV2.toDB(ports, options)
);

export default randomV2Adapter;
