import { createReducerFactory } from '@/ducks/utils';

import { RealtimeWorkspaceState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<RealtimeWorkspaceState>();
