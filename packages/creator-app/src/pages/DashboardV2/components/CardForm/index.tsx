import { CardElement } from '@stripe/react-stripe-js';
import * as stripeJS from '@stripe/stripe-js';
import { Box, CountrySelect, Input } from '@voiceflow/ui';
import React from 'react';
import * as Yup from 'yup';

import { CardHolderInfo } from '@/contexts/PaymentContext';

import * as S from './styles';

export const SCHEME = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  cardCompleted: Yup.bool().nullable().oneOf([true], 'Card is required').required('Card is required'),
});

export const INITIAL_VALUES = {
  name: '',
  address: '',
  city: '',
  state: '',
  country: '',
  cardCompleted: null,
};

interface FormValues extends CardHolderInfo {
  cardCompleted: boolean;
}

interface BillingCardFormProps {
  values: CardHolderInfo;
  setFieldTouched: (field: string, touched?: boolean | undefined) => void;
  onError: (field: string, error: string | undefined) => void;
  onChange: (eventOrField: React.ChangeEvent<HTMLInputElement> | string, value?: unknown) => void;
  errors: Partial<Record<keyof FormValues, string>>;
  touched: Partial<Record<keyof FormValues, boolean>>;
  disabled: boolean;
}

const BillingCardForm: React.FC<BillingCardFormProps> = ({
  values = INITIAL_VALUES,
  onChange,
  setFieldTouched,
  onError,
  errors,
  touched,
  disabled,
}) => {
  const handleCardChange = (event: stripeJS.StripeElementChangeEvent) => {
    if (event.error) {
      onError('cardCompleted', event.error.message);
    } else {
      onChange('cardCompleted', event.complete);
      onError('cardCompleted', undefined);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => setFieldTouched(e.target.name, true);

  const showError = React.useMemo(
    () => Object.fromEntries(Object.entries(errors).filter(([key]) => touched[key as keyof FormValues])),
    [errors, touched]
  );

  return (
    <Box.Flex column gap={16} fullWidth>
      <Box.FlexStart fullWidth column alignItems="flex-start">
        <S.CardElementContainer error={!!showError.cardCompleted} disabled={disabled}>
          <CardElement options={{ style: S.stripeInputStyle, disabled }} onChange={handleCardChange} onReady={(element) => element.focus()} />
        </S.CardElementContainer>
        {showError.cardCompleted && <S.ErrorMessage>{errors.cardCompleted}</S.ErrorMessage>}
      </Box.FlexStart>

      <Box.FlexStart column alignItems="flex-start" fullWidth>
        <Input
          name="name"
          placeholder="Name on card"
          value={values.name}
          onChange={onChange}
          onBlur={handleBlur}
          error={!!showError.name}
          disabled={disabled}
        />
        {showError.name && <S.ErrorMessage>{errors.name}</S.ErrorMessage>}
      </Box.FlexStart>
      <Box.FlexStart column alignItems="flex-start" fullWidth>
        <Input
          name="address"
          placeholder="Address"
          value={values.address}
          onChange={onChange}
          onBlur={handleBlur}
          error={!!showError.address}
          disabled={disabled}
        />
        {showError.address && <S.ErrorMessage>{errors.address}</S.ErrorMessage>}
      </Box.FlexStart>

      <Box.FlexStart gap={12} fullWidth alignItems="flex-start">
        <Box.FlexStart column alignItems="flex-start" fullWidth>
          <Input
            name="city"
            placeholder="City"
            value={values.city}
            onChange={onChange}
            onBlur={handleBlur}
            error={!!showError.city}
            disabled={disabled}
          />
          {showError.city && <S.ErrorMessage>{errors.city}</S.ErrorMessage>}
        </Box.FlexStart>
        <Box.FlexStart column alignItems="flex-start" fullWidth>
          <Input
            name="state"
            placeholder="State"
            value={values.state}
            onChange={onChange}
            onBlur={handleBlur}
            error={!!showError.state}
            disabled={disabled}
          />
          {showError.state && <S.ErrorMessage>{errors.state}</S.ErrorMessage>}
        </Box.FlexStart>
      </Box.FlexStart>
      <Box.FlexStart column alignItems="flex-start" fullWidth>
        <CountrySelect
          disabled={disabled}
          placeholder="Country"
          value={values.country}
          onChange={(country) => onChange('country', country)}
          error={!!showError.country}
        />
        {showError.country && <S.ErrorMessage>{errors.country}</S.ErrorMessage>}
      </Box.FlexStart>
    </Box.Flex>
  );
};

export default BillingCardForm;
