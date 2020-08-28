import { StepData } from '@voiceflow/alexa-types/lib/nodes/flow';

import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const flowAdapter = createBlockAdapter<StepData, NodeData.Flow>(
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

export default flowAdapter;
