import { createReducerFactory } from '@/ducks/utils';

import { ProductState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<ProductState>();
