import { createReducerFactory } from '@/ducks/utils';

import { ThreadState } from '../types';

export const createReducer = createReducerFactory<ThreadState>();
