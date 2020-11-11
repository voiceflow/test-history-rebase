import { Locale, MarketPlace, ProductType } from '@voiceflow/alexa-types';

import { DEFAULT_PRODUCT_PHRASE, NEW_PRODUCT_ID } from '@/constants';
import { Product } from '@/models';
import Locales, { MarketPlaceAvailability } from '@/services/LocaleMap';

export const getSelectedLocales = (locales: Locale[] = []) =>
  Locales.filter(({ value, inSkillProduct }) => locales.includes(value) && inSkillProduct);

export const getDefaultAvailability = () =>
  MarketPlaceAvailability.reduce<Record<MarketPlace, Product.MarketPlace>>(
    (acc, { marketPlace, currency, min, countries }) =>
      Object.assign(acc, {
        [marketPlace]: {
          price: min,
          currency,
          countries,
        },
      }),
    {} as Record<MarketPlace, Product.MarketPlace>
  );

export const createNewProduct = (locales: Locale[]): Product => ({
  id: NEW_PRODUCT_ID,
  type: ProductType.ENTITLEMENT,
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
  purchasePromptVoice: null,
  testingInstructions: null,
  subscriptionFrequency: null,
});
