import { createReducerFactory } from '@/ducks/utils';

import type { ReportTagState } from '../types';

export const createReducer = createReducerFactory<ReportTagState>();
