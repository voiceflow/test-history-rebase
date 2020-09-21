import { ProductType } from '@voiceflow/alexa-types';

import { DEFAULT_PRODUCT_PHRASE, NEW_PRODUCT_ID } from '@/constants';
import Locales, { MarketPlaceAvailability } from '@/services/LocaleMap';

export const getSelectedLocales = (locales: string[] = []) =>
  Locales.filter(({ value, inSkillProduct }) => locales.includes(value) && inSkillProduct);

export const getDefaultAvailability = () =>
  MarketPlaceAvailability.reduce(
    (acc, { marketPlace, currency, min, countries }) =>
      Object.assign(acc, {
        [marketPlace]: {
          countries,
          currency,
          price: min,
        },
      }),
    {}
  );

export const createNewProduct = (locales: string[]) => ({
  id: NEW_PRODUCT_ID,
  type: ProductType.ENTITLEMENT,
  name: '',
  version: '1.0',
  phrases: [DEFAULT_PRODUCT_PHRASE],
  locales: getSelectedLocales(locales).map(({ value }) => value),
  marketPlaces: getDefaultAvailability(),
});
