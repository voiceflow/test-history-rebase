// eslint-disable-next-line import/no-extraneous-dependencies
import { CardComponent } from '@chargebee/chargebee-js-react-wrapper';
import { CardElement } from '@stripe/react-stripe-js';
import { Box, CountrySelect, Input, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { useFormikTouchedErrors } from '@/hooks/formik';

import { useChargebeeCard, useStripeCard } from './card-form.hooks';
import * as I from './card-form.interface';
import * as S from './card-form.style';

export const CardForm: React.FC<I.Props> = ({ form, disabled, paymentGateway }) => {
  const [cardError, setCardError] = React.useState('');

  const stripeCard = useStripeCard({ form, setCardError });
  const chargebeeCard = useChargebeeCard({ form, setCardError });

  const onCountryChange = async (value: string | null) => {
    await form.setFieldValue('country', value ?? '');
    form.setFieldError('country', value ? undefined : 'Country is required');
  };

  useDidUpdateEffect(() => {
    if (form.values.cardCompleted || form.values.cardAuthorization) return;
    setCardError('Card is required');
  }, [form.submitCount]);

  // TODO: fix me
  const touchedErrors = useFormikTouchedErrors(form as any);

  return (
    <Box.Flex column gap={16} fullWidth>
      <Box.FlexStart fullWidth column alignItems="flex-start">
        <S.CardElementContainer error={!!cardError || !!touchedErrors.cardCompleted} disabled={disabled}>
          {paymentGateway === 'stripe' && (
            <CardElement
              onBlur={stripeCard.onCardBlur}
              options={{ style: S.stripeInputStyle, disabled }}
              onReady={(element) => element.focus()}
              onChange={stripeCard.onCardChange}
            />
          )}

          {paymentGateway === 'chargebee' && (
            <CardComponent
              ref={chargebeeCard.cardRef}
              onChange={chargebeeCard.onChange}
              onReady={chargebeeCard.onReady}
              onBlur={chargebeeCard.onBlur}
              styles={S.chargebeeInputStyle}
              placeholder={{
                number: 'Card number',
                expiry: 'MM/YY',
                cvv: 'CVV',
              }}
              fonts={['https://fonts.googleapis.com/css?family=Open+Sans']}
            />
          )}
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
