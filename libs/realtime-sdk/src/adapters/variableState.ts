import { createMultiAdapter } from 'bidirectional-adapter';

import type { DBVariableState, VariableState } from '@/models';

const variableStateAdapter = createMultiAdapter<DBVariableState, VariableState>(
  ({ _id, ...variableState }: DBVariableState) => ({
    ...variableState,
    id: _id,
  }),
  ({ id, ...variableState }: VariableState) => ({
    ...variableState,
    _id: id,
  })
);

export default variableStateAdapter;
