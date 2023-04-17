import { createReducerFactory } from '@/ducks/utils';

import { SlotState } from '../types';

export const createReducer = createReducerFactory<SlotState>();
