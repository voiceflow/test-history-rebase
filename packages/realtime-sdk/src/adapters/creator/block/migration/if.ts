import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { defaultNoMatch } from '../base/if';
import { createBlockAdapter } from '../utils';
import expressionV1toV2Adapter from './expression';

const ifAdapter = createBlockAdapter<BaseNode.If.StepData, NodeData.IfV2>(
  ({ expressions }) => ({
    expressions: expressionV1toV2Adapter.mapFromDB(expressions),
    noMatch: defaultNoMatch,
  }),
  ({ expressions }) => ({
    expressions: expressionV1toV2Adapter.mapToDB(expressions as any),
  })
);

export default ifAdapter;
