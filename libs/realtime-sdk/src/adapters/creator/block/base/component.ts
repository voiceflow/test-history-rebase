import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, createOutPortsAdapter, createOutPortsAdapterV2, nextOnlyOutPortsAdapter, nextOnlyOutPortsAdapterV2 } from '../utils';

const componentAdapter = createBlockAdapter<BaseNode.Component.StepData, NodeData.Component>(
  ({ diagramID, variableMap }) => ({
    inputs: variableMap?.inputs?.map(([from, to]) => ({ from, to })),
    outputs: variableMap?.outputs?.map(([from, to]) => ({ from, to })),
    diagramID,
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

export const componentOutPortsAdapter = createOutPortsAdapter<NodeData.ComponentBuiltInPorts, NodeData.Component>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const componentOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.ComponentBuiltInPorts, NodeData.Component>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default componentAdapter;
