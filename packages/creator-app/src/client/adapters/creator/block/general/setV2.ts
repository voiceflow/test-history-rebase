import { Set, StepData as SetData } from '@voiceflow/general-types/build/nodes/setV2';
import cuid from 'cuid';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const setAdapterV2 = createBlockAdapter<SetData, NodeData.SetV2>(
  ({ sets, title }) => ({
    title,
    sets: sets.map(({ expression, variable, type }) => ({
      id: cuid.slug(),
      type,
      variable,
      expression,
    })),
  }),
  ({ sets, title }) => ({
    title,
    sets: sets.map(
      ({ expression, variable, type }) =>
        ({
          type,
          variable: variable ?? null,
          expression: `${expression}` ?? '',
        } as Set)
    ),
  })
);

export default setAdapterV2;
