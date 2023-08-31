import { createReducerFactory } from '@/ducks/utils';

import { TranscriptState } from '../types';

export const createReducer = createReducerFactory<TranscriptState>();
