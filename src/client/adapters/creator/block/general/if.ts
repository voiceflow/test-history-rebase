import type { StepData as IfData } from '@voiceflow/general-types/build/nodes/if';

import expressionAdapter from '@/client/adapters/expression';
import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const ifAdapter = createBlockAdapter<IfData, NodeData.If>(
  ({ expressions }) => ({
    expressions: expressionAdapter.mapFromDB(expressions),
  }),
  ({ expressions }) => ({
    expressions: expressionAdapter.mapToDB(expressions),
  })
);

export default ifAdapter;
