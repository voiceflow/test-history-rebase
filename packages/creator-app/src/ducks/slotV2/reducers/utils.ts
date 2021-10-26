import { createReducerFactory } from '@/ducks/utils';

import { SlotState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<SlotState>();
