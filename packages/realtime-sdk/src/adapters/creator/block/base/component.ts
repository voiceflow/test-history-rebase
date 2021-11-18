import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/base-types';

import { createBlockAdapter } from '../utils';

const componentAdapter = createBlockAdapter<Node.Component.StepData, NodeData.Component>(
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

export default componentAdapter;
