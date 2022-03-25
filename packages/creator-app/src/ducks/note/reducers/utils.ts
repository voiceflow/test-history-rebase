import { createReducerFactory } from '@/ducks/utils';

import { NoteRootState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<NoteRootState>();
