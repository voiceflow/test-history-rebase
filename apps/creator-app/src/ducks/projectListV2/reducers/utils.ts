import { createReducerFactory } from '@/ducks/utils';

import { ProjectListState } from '../types';

export const createReducer = createReducerFactory<ProjectListState>();
