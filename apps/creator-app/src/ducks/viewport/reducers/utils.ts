import { createReducerFactory } from '@/ducks/utils';

import { ViewportState } from '../types';

export const createReducer = createReducerFactory<ViewportState>();
