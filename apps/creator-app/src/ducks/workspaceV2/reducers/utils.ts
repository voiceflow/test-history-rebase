import { createReducerFactory } from '@/ducks/utils';

import type { WorkspaceState } from '../types';

export const createReducer = createReducerFactory<WorkspaceState>();
