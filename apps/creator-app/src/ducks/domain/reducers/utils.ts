import { createReducerFactory } from '@/ducks/utils';

import type { DomainState } from '../types';

export const createReducer = createReducerFactory<DomainState>();
