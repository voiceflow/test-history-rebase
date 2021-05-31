import type { StepData as IfData } from '@voiceflow/general-types/build/nodes/if';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';
import expressionV1toV2Adapter from './expression';

const ifAdapter = createBlockAdapter<IfData, NodeData.IfV2>(
  ({ expressions }) => ({
    expressions: expressionV1toV2Adapter.mapFromDB(expressions),
  }),
  ({ expressions }) => ({
    expressions: expressionV1toV2Adapter.mapToDB(expressions as any),
  })
);

export default ifAdapter;
