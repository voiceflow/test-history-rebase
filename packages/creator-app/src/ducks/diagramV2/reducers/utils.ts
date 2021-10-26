import { createReducerFactory } from '@/ducks/utils';

import { DiagramState } from '../types';

export const createReducer = createReducerFactory<DiagramState>();
