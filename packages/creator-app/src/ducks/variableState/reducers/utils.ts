import { createReducerFactory } from '@/ducks/utils';

import { VariableStateCRUDState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<VariableStateCRUDState>();
