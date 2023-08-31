import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducerFactory } from '@/ducks/utils';
import { CRUDState } from '@/ducks/utils/crudV2';

export const createReducer = createReducerFactory<CRUDState<Realtime.VariableState>>();
