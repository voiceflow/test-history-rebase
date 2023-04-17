import { createReducerFactory } from '@/ducks/utils';

import { DomainState } from '../types';

export const createReducer = createReducerFactory<DomainState>();
