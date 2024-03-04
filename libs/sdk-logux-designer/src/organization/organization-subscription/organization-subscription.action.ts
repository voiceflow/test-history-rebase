import { Utils } from '@voiceflow/common';
import type { Organization, PaymentIntent, Subscription } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';

import { organizationType } from '../organization.constants';
import type { OrganizationAction, OrganizationSubscriptionAction } from '../organization.types';

export const subscriptionAction = createCRUD(organizationType('subscription'));

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends OrganizationAction {
  subscription: Organization['subscription'];
}

export const Replace = subscriptionAction.crud.replace<Replace>();

export interface CheckoutRequest extends OrganizationSubscriptionAction {
  itemPriceID: string;
  planPrice: number;
  editorSeats: number;
  period: string;
  paymentIntent: PaymentIntent;
}

export const Checkout = Utils.protocol.createAsyncAction<CheckoutRequest, Subscription>(subscriptionAction('CHECKOUT'));
