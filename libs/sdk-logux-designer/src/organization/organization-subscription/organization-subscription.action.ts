import { Utils } from '@voiceflow/common';
import type { CreditCard, Organization, Subscription } from '@voiceflow/dtos';

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

export interface CheckoutRequest extends OrganizationAction {
  itemPriceID: string;
  planPrice: number;
  editorSeats: number;
  period: string;
  card?: CreditCard;
  cardToken?: string;
}

export const Checkout = Utils.protocol.createAsyncAction<CheckoutRequest, Subscription>(subscriptionAction('CHECKOUT'));
