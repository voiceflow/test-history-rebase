import type { Organization } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export interface OrganizationState extends Normalized<Organization> {}

export const STATE_KEY = 'organization';
