import { createReducerFactory } from '@/ducks/utils';

import { ProjectState } from '../types';

export const createReducer = createReducerFactory<ProjectState>();
