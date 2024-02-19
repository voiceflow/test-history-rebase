import type { Organization } from '@voiceflow/dtos';
import { createEmpty, type Normalized } from 'normal-store';

export const INITIAL_STATE: OrganizationState = createEmpty();

export interface OrganizationState extends Normalized<Organization> {}

export const STATE_KEY = 'organization';
