import { createReducerFactory } from '@/ducks/utils';

import { IntentState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<IntentState>();
