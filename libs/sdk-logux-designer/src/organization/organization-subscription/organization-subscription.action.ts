import { Utils } from '@voiceflow/common';
import type { Organization, PaymentIntent, Subscription, SubscriptionPaymentMethod } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';

import { organizationType } from '../organization.constants';
import type { BaseOrganizationSubscriptionAction } from '../organization.types';

export type { BaseOrganizationSubscriptionAction };

export const subscriptionAction = createCRUD(organizationType('subscription'));

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends BaseOrganizationSubscriptionAction {
  subscription: Organization['subscription'];
}

export const Replace = subscriptionAction.crud.replace<Replace>();

export interface CheckoutRequest extends BaseOrganizationSubscriptionAction {
  // @Deprecated kill after a couple of weeks after deploying this PR. Use planItemPriceID instead;
  itemPriceID?: string;

  planItemPriceID: string;

  seats?: number;

  paymentIntent: PaymentIntent;

  // @Deprecated kill after a couple of weeks after deploying this PR. Use couponIDs instead;
  couponIds?: string[];

  couponIDs?: string[];
}

export const Checkout = Utils.protocol.createAsyncAction<CheckoutRequest, Subscription>(subscriptionAction('CHECKOUT'));

export interface UpdatePaymentMethod extends BaseOrganizationSubscriptionAction {
  paymentMethod: SubscriptionPaymentMethod;
}

export const UpdatePaymentMethod = Utils.protocol.createAction<UpdatePaymentMethod>(
  subscriptionAction('UPDATE_PAYMENT_METHOD')
);
