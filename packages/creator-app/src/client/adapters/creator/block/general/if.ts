import type { StepData as IfData } from '@voiceflow/general-types/build/nodes/if';

import { expressionAdapterLegacy } from '@/client/adapters/expression';
import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const ifAdapter = createBlockAdapter<IfData, NodeData.If>(
  ({ expressions }) => ({
    expressions: expressionAdapterLegacy.mapFromDB(expressions),
  }),
  ({ expressions }) => ({
    expressions: expressionAdapterLegacy.mapToDB(expressions),
  })
);

export default ifAdapter;
