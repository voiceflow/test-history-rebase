import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, createOutPortsAdapter, createOutPortsAdapterV2, nextOnlyOutPortsAdapter, nextOnlyOutPortsAdapterV2 } from '../utils';

const flowAdapter = createBlockAdapter<BaseNode.Flow.StepData, NodeData.Flow>(
  ({ diagramID, variableMap }) => ({
    diagramID,
    inputs: variableMap?.inputs?.map(([from, to]) => ({ from, to })),
    outputs: variableMap?.outputs?.map(([from, to]) => ({ from, to })),
  }),
  ({ diagramID, inputs, outputs }) => ({
    diagramID,
    variableMap:
      inputs?.length || outputs?.length
        ? {
            inputs: inputs?.map(({ from, to }) => [from, to]) ?? [],
            outputs: outputs?.map(({ from, to }) => [from, to]) ?? [],
          }
        : null,
  })
);

export const flowOutPortsAdapter = createOutPortsAdapter<NodeData.FlowBuiltInPorts, NodeData.Flow>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const flowOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.FlowBuiltInPorts, NodeData.Flow>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default flowAdapter;
