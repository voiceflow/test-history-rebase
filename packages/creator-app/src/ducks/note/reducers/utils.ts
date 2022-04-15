import { createReducerFactory } from '@/ducks/utils';

import { NoteRootState } from '../types';

export const createReducer = createReducerFactory<NoteRootState>();
