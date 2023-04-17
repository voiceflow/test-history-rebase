import { createReducerFactory } from '@/ducks/utils';

import { IntentState } from '../types';

export const createReducer = createReducerFactory<IntentState>();
