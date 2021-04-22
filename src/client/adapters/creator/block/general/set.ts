import { StepData } from '@voiceflow/general-types/build/nodes/set';
import cuid from 'cuid';

import expressionAdapter from '@/client/adapters/expression';
import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const setAdapter = createBlockAdapter<StepData, NodeData.Set>(
  ({ sets }) => ({
    sets: sets.map(({ expression, variable }) => ({
      id: cuid.slug(),
      variable,
      expression: expressionAdapter.fromDB(expression),
    })),
  }),
  ({ sets }) => ({
    sets: sets.map(({ expression, variable }) => ({
      variable: variable ?? null,
      expression: expressionAdapter.toDB(expression as any),
    })),
  })
);

export default setAdapter;
