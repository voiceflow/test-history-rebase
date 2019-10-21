import expressionAdapter from '@/client/adapters/expression';

import { createBlockAdapter } from './utils';

const setBlockAdapter = createBlockAdapter(
  ({ sets }) => ({
    sets: sets.map(({ expression, variable }) => ({
      expression: expressionAdapter.fromDB(expression),
      variable: variable || null,
    })),
  }),
  ({ sets }) => ({
    sets: sets.map(({ expression, variable }) => ({
      expression: expressionAdapter.toDB(expression),
      variable: variable || null,
    })),
  })
);

export default setBlockAdapter;
