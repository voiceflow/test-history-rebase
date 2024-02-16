import { createReducerFactory } from '../utils';
import { OrganizationState } from './organization.state';

export const createOrganizationReducer = createReducerFactory<OrganizationState>();
