import { CardElement } from '@stripe/react-stripe-js';
import * as stripeJS from '@stripe/stripe-js';
import { Box, CountrySelect, Input, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { useFormikTouchedErrors } from '@/hooks/formik';

import * as I from './card-form.interface';
import * as S from './card-form.style';

export const CardForm: React.FC<I.Props> = ({ form, disabled }) => {
  const [cardError, setCardError] = React.useState('');

  const onCardChange = (event: stripeJS.StripeElementChangeEvent) => {
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

  const onCountryChange = async (value: string | null) => {
    await form.setFieldValue('country', value ?? '');
    form.setFieldError('country', value ? undefined : 'Country is required');
  };

  useDidUpdateEffect(() => {
    if (form.values.cardCompleted) return;

    setCardError('Card is required');
  }, [form.submitCount]);

  const touchedErrors = useFormikTouchedErrors(form);

  return (
    <Box.Flex column gap={16} fullWidth>
      <Box.FlexStart fullWidth column alignItems="flex-start">
        <S.CardElementContainer error={!!cardError || !!touchedErrors.cardCompleted} disabled={disabled}>
          <CardElement
            onBlur={onCardBlur}
            options={{ style: S.stripeInputStyle, disabled }}
            onReady={(element) => element.focus()}
            onChange={onCardChange}
          />
        </S.CardElementContainer>

        {(cardError || touchedErrors.cardCompleted) && <S.ErrorMessage>{cardError || touchedErrors.cardCompleted}</S.ErrorMessage>}
      </Box.FlexStart>

      <Box.FlexStart column alignItems="flex-start" fullWidth>
        <Input
          name="name"
          value={form.values.name}
          error={!!touchedErrors.name}
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          disabled={disabled}
          placeholder="Name on card"
        />
        {touchedErrors.name && <S.ErrorMessage>{touchedErrors.name}</S.ErrorMessage>}
      </Box.FlexStart>

      <Box.FlexStart column alignItems="flex-start" fullWidth>
        <Input
          name="address"
          error={!!touchedErrors.address}
          value={form.values.address}
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          disabled={disabled}
          placeholder="Address"
        />
        {touchedErrors.address && <S.ErrorMessage>{touchedErrors.address}</S.ErrorMessage>}
      </Box.FlexStart>

      <Box.FlexStart gap={12} fullWidth alignItems="flex-start">
        <Box.FlexStart column alignItems="flex-start" fullWidth>
          <Input
            name="city"
            value={form.values.city}
            error={!!touchedErrors.city}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
            disabled={disabled}
            placeholder="City"
          />

          {touchedErrors.city && <S.ErrorMessage>{touchedErrors.city}</S.ErrorMessage>}
        </Box.FlexStart>

        <Box.FlexStart column alignItems="flex-start" fullWidth>
          <Input
            name="state"
            error={!!touchedErrors.state}
            value={form.values.state}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
            disabled={disabled}
            placeholder="State"
          />

          {touchedErrors.state && <S.ErrorMessage>{touchedErrors.state}</S.ErrorMessage>}
        </Box.FlexStart>
      </Box.FlexStart>

      <Box.FlexStart column alignItems="flex-start" fullWidth>
        <CountrySelect
          error={!!touchedErrors.country}
          value={form.values.country}
          onClose={() => form.setFieldTouched('country', true)}
          onChange={onCountryChange}
          disabled={disabled}
          placeholder="Country"
        />

        {touchedErrors.country && <S.ErrorMessage>{touchedErrors.country}</S.ErrorMessage>}
      </Box.FlexStart>
    </Box.Flex>
  );
};
