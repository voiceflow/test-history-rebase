import { AdditionalData, Component, PaymentIntent as ChargebeePaymentIntent } from '@chargebee/chargebee-js-types';
import { PaymentIntent } from '@voiceflow/dtos';
import { CONTRIES_MAPPER, toast } from '@voiceflow/ui';
import { useRef } from 'react';

import { designerClient } from '@/client/designer';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';
import { isUUID4 } from '@/utils/crypto';
import * as chargebee from '@/vendors/chargebee';

import * as CardForm from '../CardForm';

const isMockedPaymentIntent = (paymentIntent: PaymentIntent) =>
  isUUID4(paymentIntent.id) && !paymentIntent.gatewayAccountId;

const getCardAdditionalData = (cardValues: CardForm.Values): AdditionalData => ({
  billingAddress: {
    addressLine1: cardValues.address,
    city: cardValues.city,
    state: cardValues.state,
    countryCode: CONTRIES_MAPPER[cardValues.country]?.code,
  },
  customer: {
    firstName: cardValues.name.split(' ')[0],
    lastName: cardValues.name.split(' ')[1],
  },
});

const fromChargebeePaymentIntent = (
  validatedPaymentIntent: ChargebeePaymentIntent,
  paymentIntent: PaymentIntent
): PaymentIntent => ({
  ...paymentIntent,
  amount: validatedPaymentIntent.amount,
  currencyCode: validatedPaymentIntent.currency_code,
  gateway: validatedPaymentIntent.gateway,
  gatewayAccountId: validatedPaymentIntent.gateway_account_id,
  id: validatedPaymentIntent.id,
  paymentMethodType: validatedPaymentIntent.payment_method_type,
  status: validatedPaymentIntent.status,
  referenceID: validatedPaymentIntent.reference_id,
});

const toChargebeePaymentIntent = (paymentIntent: PaymentIntent): ChargebeePaymentIntent => ({
  amount: paymentIntent.amount,
  id: paymentIntent.id,
  gateway_account_id: paymentIntent.gatewayAccountId,
  status: paymentIntent.status as ChargebeePaymentIntent['status'],
  currency_code: paymentIntent.currencyCode ?? 'USD',
  gateway: paymentIntent.gateway as ChargebeePaymentIntent['gateway'],
  payment_method_type: paymentIntent.paymentMethodType as ChargebeePaymentIntent['payment_method_type'],
  reference_id: paymentIntent.referenceID,
});

export const useCardPaymentMethod = () => {
  const cardRef = useRef<Component>();
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector)!;
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector)!;
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector)!;
  const updateSubscriptionPaymentMethod = useDispatch(Organization.subscription.updateSubscriptionPaymentMethod);

  const authorizeExistingCard = async (paymentIntent: PaymentIntent) => {
    if (isMockedPaymentIntent(paymentIntent)) return paymentIntent;
    const cbInstance = chargebee.getClient();
    const threeDSHandler = await cbInstance.load3DSHandler();

    // setPaymentIntent does not need the option parameter, but typescript requires it
    threeDSHandler.setPaymentIntent(toChargebeePaymentIntent(paymentIntent), undefined as any);

    return new Promise<PaymentIntent>((resolve, reject) => {
      threeDSHandler.handleCardPayment(
        {},
        {
          success: (validatedPaymentIntent: ChargebeePaymentIntent) => {
            resolve(fromChargebeePaymentIntent(validatedPaymentIntent, paymentIntent));
          },
          error: (error: Error) => {
            reject(error);
          },
        }
      );
    });
  };

  const authorizeNewCard = async ({
    paymentIntent,
    cardValues,
  }: {
    paymentIntent: PaymentIntent;
    cardValues: CardForm.Values;
  }): Promise<PaymentIntent> => {
    if (!cardRef.current) throw new Error('Card not found');
    if (isMockedPaymentIntent(paymentIntent)) return paymentIntent;

    try {
      const validatedPaymentIntent = await cardRef.current.authorizeWith3ds(
        toChargebeePaymentIntent(paymentIntent),
        getCardAdditionalData(cardValues),
        {
          // eslint-disable-next-line no-console
          change: console.log,
        }
      );

      return fromChargebeePaymentIntent(validatedPaymentIntent, paymentIntent);
    } catch {
      throw new Error('Card authorization failed. Please try again.');
    }
  };

  const createPaymentIntent = async ({
    amount,
    paymentMethodReferenceID,
  }: {
    amount: number;
    // for existing credit card only
    paymentMethodReferenceID?: string;
  }) => {
    return designerClient.billing.subscription.createPaymentIntent(
      organizationID,
      {
        amount,
        customerID: subscription?.customerID,
        ...(paymentMethodReferenceID
          ? {
              // for existing credit card only
              referenceID: paymentMethodReferenceID,
            }
          : {}),
      },
      { workspaceID: workspace.id }
    );
  };

  const updatePaymentMethod = async (amount: number, cardValues: CardForm.Values) => {
    try {
      const paymentIntent = await createPaymentIntent({ amount });
      const authorizedPaymentIntent = await authorizeNewCard({ paymentIntent, cardValues });

      await updateSubscriptionPaymentMethod(authorizedPaymentIntent.id);

      toast.success('Card updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      throw error;
    }
  };

  const createAndAuthorizePaymentIntent = async (options: {
    amount: number;
    cardValues?: CardForm.Values;
    shouldUseExistingCard: boolean;
  }) => {
    const paymentIntent = await createPaymentIntent({
      amount: options.amount,
      paymentMethodReferenceID: options.shouldUseExistingCard ? subscription?.paymentMethod?.referenceID : undefined,
    });

    if (!options.shouldUseExistingCard && options.cardValues) {
      return authorizeNewCard({ paymentIntent, cardValues: options.cardValues });
    }

    return authorizeExistingCard(paymentIntent);
  };

  return {
    cardRef,
    updatePaymentMethod,
    authorizeNewCard,
    authorizeExistingCard,
    createPaymentIntent,
    createAndAuthorizePaymentIntent,
  };
};
