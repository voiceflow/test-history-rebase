import type { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import type { NodeData } from '@/models';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextAndFailOnlyOutPortsAdapter,
  nextAndFailOnlyOutPortsAdapterV2,
  outPortDataFromDB,
  outPortDataToDB,
} from '../utils';

const codeAdapter = createBlockAdapter<BaseNode.Code.StepData, NodeData.Code>(
  ({ code, paths }) => ({ code, paths }),
  ({ code, paths }) => ({ code, paths })
);

export const codeOutPortsAdapter = createOutPortsAdapter<NodeData.CodeBuiltInPorts, NodeData.Code>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const codeOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.CodeBuiltInPorts, NodeData.Code>(
  (dbPorts, options) => ({
    ...nextAndFailOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
    byKey: Utils.object.mapValue(dbPorts.byKey || {}, (port) => outPortDataFromDB(port!, options)),
  }),
  (dbPorts, options) => ({
    ...nextAndFailOnlyOutPortsAdapterV2.toDB(dbPorts, options),
    byKey: Utils.object.mapValue(dbPorts.byKey, outPortDataToDB),
  })
);

export default codeAdapter;
