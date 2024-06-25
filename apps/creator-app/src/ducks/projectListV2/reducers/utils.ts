import { createReducerFactory } from '@/ducks/utils';

import type { ProjectListState } from '../types';

export const createReducer = createReducerFactory<ProjectListState>();
