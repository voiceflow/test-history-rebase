import * as Realtime from '@voiceflow/realtime-sdk';

import * as CRUD from '@/ducks/utils/crud';
import { CRUDState } from '@/ducks/utils/crudV2';
import { VariableState } from '@/models/VariableState';

export interface VariableStateCRUDState extends CRUDState<Realtime.VariableState> {}

export type VariableStatestRootState = CRUD.CRUDState<VariableState> & {
  selectedState: Realtime.VariableState;
};
