import * as stripeJs from '@stripe/stripe-js';
import { useFormik } from 'formik';
import React from 'react';

import { Values } from './card-form.scheme';

interface FormProps {
  form: ReturnType<typeof useFormik<Values>>;
  setCardError: (error: string) => void;
}

export const useStripeCard = ({ form, setCardError }: FormProps) => {
  const onCardChange = (event: stripeJs.StripeElementChangeEvent) => {
    if (event.error) {
      setCardError(event.error.message);
      form.setFieldValue('cardCompleted', false);
    } else {
      form.setFieldValue('cardCompleted', event.complete);
      setCardError(event.empty ? 'Card is required' : '');
    }
  };

  const onCardBlur = () => {
    form.setFieldTouched('cardCompleted', true);

    if (form.values.cardCompleted || form.errors.cardCompleted) return;

    setCardError('Card is required');
  };

  return { onCardChange, onCardBlur };
};

export const useChargebeeCard = ({ form, setCardError }: FormProps) => {
  const cardRef = React.useRef<any>(null);

  // eslint-disable-next-line sonarjs/no-identical-functions
  const onChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
      form.setFieldValue('cardCompleted', false);
    } else {
      form.setFieldValue('cardCompleted', event.complete);
      setCardError(event.empty ? 'Card is required' : '');
    }
  };

  const onBlur = async () => {
    form.setFieldValue('cardCompleted', true);

    // eslint-disable-next-line no-console
    console.log('current', cardRef.current);

    try {
      const cardTokenData = await cardRef.current.tokenize();
      form.setFieldValue('cardAuthorization', {
        token: cardTokenData.token,
        vaultToken: cardTokenData.vaultToken,
        additionalInformation: cardTokenData.additional_information,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('cannot save card', error);
    }

    if (form.values.cardCompleted || form.errors.cardCompleted) return;

    setCardError('Card is required');
  };

  const onReady = (element: any) => element.focus();

  return { cardRef, onChange, onReady, onBlur };
};
