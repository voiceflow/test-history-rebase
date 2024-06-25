import { createReducerFactory } from '@/ducks/utils';

import type { ProjectState } from '../types';

export const createReducer = createReducerFactory<ProjectState>();
