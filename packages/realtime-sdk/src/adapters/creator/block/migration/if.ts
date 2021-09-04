import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { defaultNoMatch } from '../general/ifV2';
import { createBlockAdapter } from '../utils';
import expressionV1toV2Adapter from './expression';

const ifAdapter = createBlockAdapter<Node.If.StepData, NodeData.IfV2>(
  ({ expressions }) => ({
    expressions: expressionV1toV2Adapter.mapFromDB(expressions),
    noMatch: defaultNoMatch,
  }),
  ({ expressions }) => ({
    expressions: expressionV1toV2Adapter.mapToDB(expressions as any),
  })
);

export default ifAdapter;
