import { DEFAULT_PRODUCT_PHRASE, NEW_PRODUCT_ID, ProductType } from '@/constants';
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
  id: NEW_PRODUCT_ID as any,
  version: '1.0',
  type: ProductType.ENTITLEMENT,
  name: '',
  phrases: [DEFAULT_PRODUCT_PHRASE],
  marketPlaces: getDefaultAvailability(),
  locales: getSelectedLocales(locales).map(({ value }) => value),
});
