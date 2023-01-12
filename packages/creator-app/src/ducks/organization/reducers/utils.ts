import { createReducerFactory } from '@/ducks/utils';

import { OrganizationState } from '../types';

export const createReducer = createReducerFactory<OrganizationState>();
