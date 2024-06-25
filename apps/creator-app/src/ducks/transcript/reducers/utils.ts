import { createReducerFactory } from '@/ducks/utils';

import type { TranscriptState } from '../types';

export const createReducer = createReducerFactory<TranscriptState>();
