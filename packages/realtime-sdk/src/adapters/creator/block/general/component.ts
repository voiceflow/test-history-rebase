import { StepData as ComponentStepData } from '@voiceflow/base-types/build/node/component';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const componentAdapter = createBlockAdapter<ComponentStepData, NodeData.Component>(
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

export default componentAdapter;
