import * as CRUD from '@/ducks/utils/crud';
import { VariableState } from '@/models/VariableState';

export type VariableStatestState = CRUD.CRUDState<VariableState> & {
  selectedID: string | null;
};
