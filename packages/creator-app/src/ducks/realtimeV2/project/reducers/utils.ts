import { createReducerFactory } from '../../utils/reducer';
import { RealtimeProjectState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<RealtimeProjectState>();
