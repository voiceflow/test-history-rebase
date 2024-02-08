import { createCRUDState } from '@/ducks/utils/crudV2';

import { OrganizationState } from './organization.types';

export const STATE_KEY = 'organization';

export const INITIAL_STATE: OrganizationState = createCRUDState();
