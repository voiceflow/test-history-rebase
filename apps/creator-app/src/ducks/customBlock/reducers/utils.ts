import { createReducerFactory } from '@/ducks/utils';

import type { CustomBlockState } from '../types';

export const createReducer = createReducerFactory<CustomBlockState>();
