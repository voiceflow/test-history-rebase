import { createReducerFactory } from '@/ducks/utils';

import { ReportTagState } from '../types';

export const createReducer = createReducerFactory<ReportTagState>();
