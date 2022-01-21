/* eslint-disable @typescript-eslint/no-empty-interface */
import * as Realtime from '@voiceflow/realtime-sdk';

import * as CRUD from '@/ducks/utils/crud';
import { CRUDState } from '@/ducks/utils/crudV2';
import { VariableState } from '@/models/VariableState';

export interface VariableStateCRUDState extends CRUDState<Realtime.VariableState> {}

export type VariableStatestRootState = CRUD.CRUDState<VariableState> & {
  selectedID: string | null;
};
