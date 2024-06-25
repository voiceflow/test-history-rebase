import { createReducerFactory } from '@/ducks/utils';

import type { VersionState } from '../types';

export const createReducer = createReducerFactory<VersionState>();
