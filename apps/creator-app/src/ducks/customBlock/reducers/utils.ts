import { createReducerFactory } from '@/ducks/utils';

import { CustomBlockState } from '../types';

export const createReducer = createReducerFactory<CustomBlockState>();
