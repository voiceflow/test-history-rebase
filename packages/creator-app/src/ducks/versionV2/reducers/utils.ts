import { createReducerFactory } from '@/ducks/utils';

import { VersionState } from '../types';

export const createReducer = createReducerFactory<VersionState>();
