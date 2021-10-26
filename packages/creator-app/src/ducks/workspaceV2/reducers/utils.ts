import { createReducerFactory } from '@/ducks/utils';

import { WorkspaceState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<WorkspaceState>();
