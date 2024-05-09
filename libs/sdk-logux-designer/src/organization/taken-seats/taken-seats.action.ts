import type { TakenSeats } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';

import { organizationType } from '../organization.constants';
import type { BaseOrganizationSubscriptionAction } from '../organization.types';

export const organizationTakenSeatsAction = createCRUD(organizationType('taken-seats'));

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends BaseOrganizationSubscriptionAction {
  takenSeats: TakenSeats;
}

export const Replace = organizationTakenSeatsAction.crud.replace<Replace>();
