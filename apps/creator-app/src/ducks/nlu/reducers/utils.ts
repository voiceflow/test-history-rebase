import { createReducerFactory } from '@/ducks/utils';

import { NLUState } from '../types';

export const createReducer = createReducerFactory<NLUState>();
