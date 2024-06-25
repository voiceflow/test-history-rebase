import { CardComponent } from '@chargebee/chargebee-js-react-wrapper';
import type { Component } from '@chargebee/chargebee-js-types';
import { Box, CountrySelect, Input } from '@voiceflow/ui';
import type { useFormik } from 'formik';
import React from 'react';

import { useFormikTouchedErrors } from '@/hooks/formik';

import type { Values } from './CardForm.scheme';
import * as S from './CardForm.style';

export interface CardFormProps {
  cardError: string;
  form: ReturnType<typeof useFormik<Values>>;
  disabled?: boolean;
}

const CARD_REQUIRED_ERROR_MESSAGE = 'Card is required';

export const CardForm = React.forwardRef(
  ({ form, cardError: cardErrorControlledState, disabled }: CardFormProps, ref: any) => {
    const [cardError, setCardError] = React.useState(cardErrorControlledState);

    const onCountryChange = async (value: string | null) => {
      await form.setFieldValue('country', value ?? '');
      form.setFieldError('country', value ? undefined : 'Country is required');
    };

    const onCardChange = (event: any) => {
      if (event.error) {
        setCardError(event.error.message);
        form.setFieldValue('cardCompleted', false);
      } else {
        form.setFieldValue('cardCompleted', event.complete);
        setCardError(event.empty ? CARD_REQUIRED_ERROR_MESSAGE : '');
      }
    };

    const onCardBlur = () => {
      form.setFieldTouched('cardCompleted', true);

      if (form.values.cardCompleted || form.errors.cardCompleted) return;

      setCardError(CARD_REQUIRED_ERROR_MESSAGE);
    };

    React.useEffect(() => {
      setCardError(cardErrorControlledState);
    }, [cardErrorControlledState]);

    const touchedErrors = useFormikTouchedErrors(form);

    return (
      <Box.Flex column gap={16} fullWidth>
        <Box.FlexStart column fullWidth alignItems="flex-start">
          <S.CardElementContainer error={!!cardError || !!touchedErrors.cardCompleted} disabled={disabled}>
            <CardComponent
              ref={ref}
              onBlur={onCardBlur}
              onChange={onCardChange}
              onReady={() => (ref.current as Component)?.focus()}
              styles={S.chargebeeInputStyle}
              placeholder={{ number: 'Card number' }}
              fonts={S.chargebeeInputFonts}
            />
          </S.CardElementContainer>

          {(touchedErrors.cardCompleted || cardError) && (
            <S.ErrorMessage>{cardError || touchedErrors.cardCompleted}</S.ErrorMessage>
          )}
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
  }
);
