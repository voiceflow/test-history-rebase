import { createReducerFactory } from '@/ducks/utils';

import type { ViewportState } from '../types';

export const createReducer = createReducerFactory<ViewportState>();
