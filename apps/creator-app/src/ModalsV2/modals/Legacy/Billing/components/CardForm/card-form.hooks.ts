import type * as stripeJs from '@stripe/stripe-js';
import type { useFormik } from 'formik';

import type { Values } from './card-form.scheme';

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
