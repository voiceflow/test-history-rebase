import { createReducerFactory } from '../../utils/reducer';
import { RealtimeWorkspaceState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<RealtimeWorkspaceState>();
