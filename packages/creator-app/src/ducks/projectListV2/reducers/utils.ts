import { createReducerFactory } from '@/ducks/utils';

import { ProjectListState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<ProjectListState>();
