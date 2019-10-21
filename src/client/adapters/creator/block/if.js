import expressionAdapter from '@/client/adapters/expression';

import { createBlockAdapter } from './utils';

const ifBlockAdapter = createBlockAdapter(
  ({ expressions }) => ({
    expressions: expressionAdapter.mapFromDB(expressions),
  }),
  ({ expressions }) => ({
    expressions: expressionAdapter.mapToDB(expressions),
  })
);

export default ifBlockAdapter;
