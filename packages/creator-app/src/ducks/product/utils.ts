import { AlexaConstants, AlexaProject } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { DEFAULT_PRODUCT_PHRASE, NEW_PRODUCT_ID } from '@/constants';
import Locales, { MarketPlaceAvailability } from '@/services/LocaleMap';

export const getSelectedLocales = (locales: AlexaConstants.Locale[] = []) =>
  Locales.filter(({ value, inSkillProduct }) => locales.includes(value) && inSkillProduct);

export const getDefaultAvailability = () =>
  MarketPlaceAvailability.reduce<Record<AlexaProject.MarketPlace, Realtime.ProductMarketPlace>>(
    (acc, { marketPlace, currency, min, countries }) =>
      Object.assign(acc, {
        [marketPlace]: {
          price: min,
          currency,
          countries,
        },
      }),
    {} as Record<AlexaProject.MarketPlace, Realtime.ProductMarketPlace>
  );

export const createNewProduct = (locales: AlexaConstants.Locale[]): Realtime.Product => ({
  id: NEW_PRODUCT_ID,
  type: AlexaConstants.ProductType.ENTITLEMENT,
  name: '',
  skill: '',
  summary: '',
  version: '1.0',
  phrases: [DEFAULT_PRODUCT_PHRASE],
  locales: getSelectedLocales(locales).map(({ value }) => value),
  keywords: [],
  description: '',
  taxCategory: null,
  marketPlaces: getDefaultAvailability(),
  smallIconUri: null,
  largeIconUri: null,
  referenceName: '',
  purchasePrompt: null,
  trialPeriodDays: null,
  cardDescription: null,
  privacyPolicyUrl: null,
  purchasableState: null,
  testingInstructions: null,
  subscriptionFrequency: null,
});
