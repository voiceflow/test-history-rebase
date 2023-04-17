import { createReducerFactory } from '@/ducks/utils';

import { VariableStateCRUDState } from '../types';

export const createReducer = createReducerFactory<VariableStateCRUDState>();
