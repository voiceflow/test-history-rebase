import { createReducerFactory } from '@/ducks/utils';

import { ProductState } from '../types';

export const createReducer = createReducerFactory<ProductState>();
