import * as Realtime from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crudV2';

export interface VariableStateCRUDState extends CRUDState<Realtime.VariableState> {}

export interface VariableStatestRootState extends VariableStateCRUDState {
  selectedState: Realtime.VariableState | null;
}
