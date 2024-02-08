import type { Organization } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

import type { organizationReducer } from './organization.reducer';

export interface OrganizationOnlyState extends Normalized<Organization> {}

export const STATE_KEY = 'organization';

export type OrganizationState = typeof organizationReducer;
