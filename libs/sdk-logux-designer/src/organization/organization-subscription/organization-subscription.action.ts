import { Utils } from '@voiceflow/common';
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

export interface ReplaceScheduled extends OrganizationAction {
  scheduledSubscription: Organization['subscription'];
}

export const ReplaceScheduled = Utils.protocol.createAction<ReplaceScheduled>(subscriptionAction('REPLACE_SCHEDULED'));

export interface Checkout extends OrganizationAction {
  subscriptionID: string;
  itemPriceID: string;
  editorSeats: number;
}

export const Checkout = Utils.protocol.createAction<Checkout>(subscriptionAction('CHECKOUT'));
