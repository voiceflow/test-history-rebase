import { createBlockAdapter } from './utils';

const flowBlockAdapter = createBlockAdapter(
  ({ diagram_id, inputs, outputs }) => ({
    diagramID: diagram_id || null,
    inputs: inputs.map(({ arg1, arg2 }) => ({
      from: arg1 || null,
      to: arg2 || null,
    })),
    outputs: outputs.map(({ arg1, arg2 }) => ({
      from: arg1 || null,
      to: arg2 || null,
    })),
  }),
  ({ diagramID, inputs, outputs }) => ({
    diagram_id: diagramID,
    inputs: inputs.map(({ from, to }) => ({
      arg1: from,
      arg2: to,
    })),
    outputs: outputs.map(({ from, to }) => ({
      arg1: from,
      arg2: to,
    })),
  })
);

export default flowBlockAdapter;
