import type { Organization } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';

import { organizationType } from '../organization.constants';
import type { OrganizationAction } from '../organization.types';

export const subscriptionAction = createCRUD(organizationType('subscription'));

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends OrganizationAction {
  subscription: Organization['subscription'];
}

export const Replace = subscriptionAction.crud.replace<Replace>();
