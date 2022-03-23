import { createReducerFactory } from '@/ducks/utils';

import { ViewportState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<ViewportState>();
