import { StepData as SetData } from '@voiceflow/general-types/build/nodes/set';
import cuid from 'cuid';

import { expressionAdapterLegacy } from '@/client/adapters/expression';
import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const setAdapter = createBlockAdapter<SetData, NodeData.Set>(
  ({ sets }) => ({
    sets: sets.map(({ expression, variable }) => ({
      id: cuid.slug(),
      variable,
      expression: expressionAdapterLegacy.fromDB(expression),
    })),
  }),
  ({ sets }) => ({
    sets: sets.map(({ expression, variable }) => ({
      variable: variable ?? null,
      expression: expressionAdapterLegacy.toDB(expression),
    })),
  })
);

export default setAdapter;
