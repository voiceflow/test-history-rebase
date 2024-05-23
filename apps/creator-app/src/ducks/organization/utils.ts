import { createReducerFactory } from '@/ducks/utils';

import { OrganizationState } from './organization.state';

export const createReducer = createReducerFactory<OrganizationState>();
