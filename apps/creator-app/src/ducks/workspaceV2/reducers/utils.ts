import { createReducerFactory } from '@/ducks/utils';

import { WorkspaceState } from '../types';

export const createReducer = createReducerFactory<WorkspaceState>();
