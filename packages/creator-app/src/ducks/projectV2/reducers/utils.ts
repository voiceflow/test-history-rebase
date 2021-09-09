import { createReducerFactory } from '@/ducks/utils';

import { RealtimeProjectState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<RealtimeProjectState>();
