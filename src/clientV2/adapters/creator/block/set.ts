import type { StepData } from '@voiceflow/alexa-types/build/nodes/set';
import cuid from 'cuid';

import expressionAdapter from '@/clientV2/adapters/expression';
import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const setBlockAdapter = createBlockAdapter<StepData, NodeData.Set>(
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
      expression: expressionAdapter.toDB(expression),
    })),
  })
);

export default setBlockAdapter;
