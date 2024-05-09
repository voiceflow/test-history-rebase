import { AdditionalData, Component, PaymentIntent as ChargebeePaymentIntent } from '@chargebee/chargebee-js-types';
import { PaymentIntent } from '@voiceflow/dtos';
import { CONTRIES_MAPPER, IS_DEVELOPMENT, toast } from '@voiceflow/ui';
import { useAtom } from 'jotai';
import camelCase from 'lodash/camelCase';
import { useRef } from 'react';

import { designerClient } from '@/client/designer';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { isUUID4 } from '@/utils/crypto';

import * as CardForm from '../components/CardForm';
import * as atoms from '../Payment.atoms';

const isMockedPaymentIntent = (paymentIntent: PaymentIntent) => isUUID4(paymentIntent.id) && !paymentIntent.gatewayAccountId;

export const useCardPaymentMethod = () => {
  const cardRef = useRef<Component>();
  const [paymentIntent, setPaymentIntent] = useAtom(atoms.paymentIntentAtom);
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector)!;

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

  const createPaymentIntent = async (planPrice: number, cardValues: CardForm.Values) => {
    // we divide de price by 100 to show on the UI, but backend expects the amount in cents
    let amount = planPrice * 100;

    if (IS_DEVELOPMENT) {
      console.log('Testing payment intent creation with amount:', amount, 'and card values:', cardValues); // eslint-disable-line no-console

      // for testing purpose we get the amount from the address
      const amountFromAddressInput = cardValues.address.split(' ')[cardValues.address.length - 1];
      if (amountFromAddressInput && Number(amountFromAddressInput) > 0) {
        amount = Number(amountFromAddressInput);
      }
    }

    return designerClient.billing.subscription.createPaymentIntent(organizationID, {
      json: {
        amount,
      },
    });
  };

  const authorize = async (paymentIntent: PaymentIntent, cardValues: CardForm.Values): Promise<PaymentIntent> => {
    if (!cardRef.current) return paymentIntent;

    let paymentIntentData: PaymentIntent = paymentIntent;

    await cardRef.current.authorizeWith3ds(
      {
        amount: paymentIntentData.amount,
        id: paymentIntentData.id,
        gateway_account_id: paymentIntentData.gatewayAccountId,
        status: paymentIntentData.status as ChargebeePaymentIntent['status'],
        currency_code: paymentIntentData.currencyCode ?? 'USD',
        gateway: paymentIntentData.gateway as ChargebeePaymentIntent['gateway'],
        payment_method_type: paymentIntent.paymentMethodType as ChargebeePaymentIntent['payment_method_type'],
      },
      getCardAdditionalData(cardValues),
      {
        success: (validatedPaymentIntent: ChargebeePaymentIntent) => {
          const validatedData = Object.entries(validatedPaymentIntent).reduce(
            (acc, [key, value]) => ({ ...acc, [camelCase(key)]: value }),
            {} as ChargebeePaymentIntent
          );

          paymentIntentData = {
            ...paymentIntentData,
            ...validatedData,
            amount: validatedPaymentIntent.amount,
            currencyCode: validatedPaymentIntent.currency_code,
            gateway: validatedPaymentIntent.gateway,
            gatewayAccountId: validatedPaymentIntent.gateway_account_id,
            id: validatedPaymentIntent.id,
            paymentMethodType: validatedPaymentIntent.payment_method_type,
            status: validatedPaymentIntent.status,
          };
        },
        // eslint-disable-next-line no-console
        change: console.log,
      }
    );

    return paymentIntentData;
  };

  const onAuthorize = async (planPrice: number, cardValues: CardForm.Values): Promise<PaymentIntent | null> => {
    if (!cardRef.current) return null;
    let paymentIntentResult = paymentIntent;

    paymentIntentResult = await createPaymentIntent(planPrice, cardValues);

    setPaymentIntent(paymentIntentResult);

    if (!paymentIntentResult) return null;

    if (isMockedPaymentIntent(paymentIntentResult)) {
      return paymentIntentResult;
    }

    try {
      paymentIntentResult = await authorize(paymentIntentResult, cardValues);
      setPaymentIntent(paymentIntentResult);
    } catch (error) {
      toast.error('Failed to authorize your payment method');
      throw error;
    }

    return paymentIntentResult;
  };

  return { cardRef, paymentIntent, onAuthorize };
};
