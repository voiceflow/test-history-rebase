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
  itemPriceID: string;
  paymentIntent: PaymentIntent;
  couponIds?: string[];
}

export const Checkout = Utils.protocol.createAsyncAction<CheckoutRequest, Subscription>(subscriptionAction('CHECKOUT'));

export interface UpdatePaymentMethod extends BaseOrganizationSubscriptionAction {
  paymentMethod: SubscriptionPaymentMethod;
}

export const UpdatePaymentMethod = Utils.protocol.createAction<UpdatePaymentMethod>(
  subscriptionAction('UPDATE_PAYMENT_METHOD')
);
