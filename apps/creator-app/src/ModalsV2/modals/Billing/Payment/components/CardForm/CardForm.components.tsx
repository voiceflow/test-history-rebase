import { Box, CountrySelect, Input, useDidUpdateEffect } from '@voiceflow/ui';
import { useFormik } from 'formik';
import React from 'react';

import { useFormikTouchedErrors } from '@/hooks/formik';

import { Values } from './CardForm.scheme';
import * as S from './CardForm.style';

export interface CardFormProps {
  form: ReturnType<typeof useFormik<Values>>;
  disabled?: boolean;
}

const CARD_REQUIRED_ERROR_MESSAGE = 'Card is required';

export const CardForm: React.FC<CardFormProps> = ({ form, disabled }) => {
  const [cardError, setCardError] = React.useState('');

  // eslint-disable-next-line no-console
  console.log({ cardError });

  const onCountryChange = async (value: string | null) => {
    await form.setFieldValue('country', value ?? '');
    form.setFieldError('country', value ? undefined : 'Country is required');
  };

  useDidUpdateEffect(() => {
    if (form.values.cardNumber) return;
    setCardError(CARD_REQUIRED_ERROR_MESSAGE);
  }, [form.submitCount]);

  const touchedErrors = useFormikTouchedErrors(form as any);

  return (
    <Box.Flex column gap={16} fullWidth>
      <Box.FlexStart fullWidth alignItems="flex-start">
        <Box.FlexStart fullWidth>
          <Input
            name="cardNumber"
            error={!!touchedErrors?.card}
            value={form.values.cardNumber}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
            disabled={disabled}
            placeholder="4111 1111 1111 1111"
          />
        </Box.FlexStart>

        <Box.FlexStart ml={8}>
          <Input
            name="cardExpiry"
            error={!!touchedErrors?.card}
            value={form.values.cardExpiry}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
            disabled={disabled}
            placeholder="12/2030"
          />

          <Box ml={4}>
            <Input
              name="cardCvv"
              error={!!touchedErrors?.card}
              value={form.values.cardCvv}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              disabled={disabled}
              placeholder="123"
            />
          </Box>
        </Box.FlexStart>

        {touchedErrors?.card && <S.ErrorMessage>{touchedErrors.card}</S.ErrorMessage>}
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
