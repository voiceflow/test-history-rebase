import { Node } from '@voiceflow/base-types';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';
import expressionV1toV2Adapter from './expression';

const ifAdapter = createBlockAdapter<Node.If.StepData, NodeData.IfV2>(
  ({ expressions }) => ({
    expressions: expressionV1toV2Adapter.mapFromDB(expressions),
  }),
  ({ expressions }) => ({
    expressions: expressionV1toV2Adapter.mapToDB(expressions as any),
  })
);

export default ifAdapter;
