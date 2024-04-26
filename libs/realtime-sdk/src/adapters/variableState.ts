import type { DBVariableState, VariableState } from '@realtime-sdk/models';
import { createMultiAdapter } from 'bidirectional-adapter';

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
