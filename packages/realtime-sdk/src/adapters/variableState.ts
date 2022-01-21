import { DBVariableState, VariableState } from '@realtime-sdk/models';
import createAdapter from 'bidirectional-adapter';

const variableStateAdapter = createAdapter<DBVariableState, VariableState>(
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
