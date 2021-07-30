import { createReducerFactory } from '../../utils/reducer';
import { RealtimeProjectListState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<RealtimeProjectListState>();
