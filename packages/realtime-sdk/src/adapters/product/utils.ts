import { decodeMarketPlaceKey, encodeMarketPlaceKey, Locale } from '@voiceflow/alexa-types';
import { AlexaProduct, MarketPlace, PublishingLocale, PublishingPrice } from '@voiceflow/alexa-types/build/project/product';
import moment from 'moment';

import { Product, ProductMarketPlace } from '../../models';
import { getKeys } from '../../utils/object';
import { MARKET_PLACE_AVAILABILITY } from './constants';

export type MergedLocale = Pick<
  Product,
  'summary' | 'description' | 'smallIconUri' | 'largeIconUri' | 'phrases' | 'keywords' | 'cardDescription' | 'purchasePrompt' | 'privacyPolicyUrl'
>;

// app to db

export const getDistributionCountries = (marketPlaces: Partial<Record<MarketPlace, ProductMarketPlace>>): string[] =>
  Object.values(marketPlaces)
    .map((place) => place.countries)
    .reduce((a, b) => a.concat(b), []);

export const formatMarketPlaces = (marketPlaces: Partial<Record<MarketPlace, ProductMarketPlace>>): Partial<Record<MarketPlace, PublishingPrice>> => {
  // find any valid release date
  const generalReleaseDate = Object.values(marketPlaces).find((place) => !!place?.releaseDate)?.releaseDate || moment().format('YYYY-MM-DD');

  return getKeys(marketPlaces).reduce<Partial<Record<MarketPlace, PublishingPrice>>>((acc, key) => {
    const place = marketPlaces[key];

    if (place) {
      acc[encodeMarketPlaceKey(key) as MarketPlace] = {
        releaseDate: place.releaseDate || generalReleaseDate,
        defaultPriceListing: {
          price: +place.price || 0,
          currency: place.currency,
        },
      };
    }

    return acc;
  }, {});
};

// db to app

export const parseMarketPlaces = (
  allPlaces: Partial<Record<MarketPlace, PublishingPrice>>,
  distributionCountries: string[]
): Partial<Record<MarketPlace, ProductMarketPlace>> =>
  getKeys(allPlaces).reduce<Partial<Record<MarketPlace, ProductMarketPlace>>>((acc, encodedKey) => {
    const place = allPlaces[encodedKey];

    if (place) {
      const placeKey = decodeMarketPlaceKey(encodedKey);

      acc[placeKey] = {
        ...place.defaultPriceListing,
        releaseDate: place.releaseDate,
        countries:
          MARKET_PLACE_AVAILABILITY.find(({ marketPlace }) => marketPlace === placeKey)?.countries.filter((country) =>
            distributionCountries.includes(country)
          ) ?? [],
      };
    }

    return acc;
  }, {});

export const parseLocales = (
  locales: Partial<Record<Locale, PublishingLocale>>,
  privacyAndCompliance: AlexaProduct['privacyAndCompliance']
): MergedLocale =>
  getKeys(locales).reduce<MergedLocale>(
    (acc, locale) => {
      const localeData = locales[locale];

      if (localeData) {
        const localeToMerge: MergedLocale = {
          summary: localeData.summary,
          phrases: localeData.examplePhrases,
          keywords: localeData.keywords || [],
          description: localeData.description,
          smallIconUri: localeData.smallIconUri || '',
          largeIconUri: localeData.largeIconUri || '',
          purchasePrompt: localeData.customProductPrompts.purchasePromptDescription || null,
          cardDescription: localeData.customProductPrompts.boughtCardDescription || null,
          privacyPolicyUrl: privacyAndCompliance.locales[locale]?.privacyPolicyUrl || null,
        };

        Object.assign(acc, localeToMerge);
      }

      return acc;
    },
    {
      summary: '',
      phrases: [],
      keywords: [],
      description: '',
      smallIconUri: null,
      largeIconUri: null,
      purchasePrompt: null,
      cardDescription: null,
      privacyPolicyUrl: null,
    }
  );
