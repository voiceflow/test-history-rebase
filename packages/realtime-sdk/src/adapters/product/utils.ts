import { Product, ProductMarketPlace } from '@realtime-sdk/models';
import { AlexaConstants, AlexaProject } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import dayjs from 'dayjs';

import { MARKET_PLACE_AVAILABILITY } from './constants';

export type MergedLocale = Pick<
  Product,
  'summary' | 'description' | 'smallIconUri' | 'largeIconUri' | 'phrases' | 'keywords' | 'cardDescription' | 'purchasePrompt' | 'privacyPolicyUrl'
>;

// app to db

export const getDistributionCountries = (marketPlaces: Partial<Record<AlexaProject.MarketPlace, ProductMarketPlace>>): string[] =>
  Object.values(marketPlaces)
    .map((place) => place.countries)
    .reduce((a, b) => a.concat(b), []);

export const formatMarketPlaces = (
  marketPlaces: Partial<Record<AlexaProject.MarketPlace, ProductMarketPlace>>
): Partial<Record<AlexaProject.MarketPlace, AlexaProject.PublishingPrice>> => {
  // find any valid release date
  const generalReleaseDate = Object.values(marketPlaces).find((place) => !!place?.releaseDate)?.releaseDate || dayjs().format('YYYY-MM-DD');

  return Utils.object.getKeys(marketPlaces).reduce<Partial<Record<AlexaProject.MarketPlace, AlexaProject.PublishingPrice>>>((acc, key) => {
    const place = marketPlaces[key];

    if (place) {
      acc[AlexaProject.encodeMarketPlaceKey(key) as AlexaProject.MarketPlace] = {
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
  allPlaces: Partial<Record<AlexaProject.MarketPlace, AlexaProject.PublishingPrice>>,
  distributionCountries: string[]
): Partial<Record<AlexaProject.MarketPlace, ProductMarketPlace>> =>
  Utils.object.getKeys(allPlaces).reduce<Partial<Record<AlexaProject.MarketPlace, ProductMarketPlace>>>((acc, encodedKey) => {
    const place = allPlaces[encodedKey];

    if (place) {
      const placeKey = AlexaProject.decodeMarketPlaceKey(encodedKey);

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
  locales: Partial<Record<AlexaConstants.Locale, AlexaProject.PublishingLocale>>,
  privacyAndCompliance: AlexaProject.Product['privacyAndCompliance']
): MergedLocale =>
  Utils.object.getKeys(locales).reduce<MergedLocale>(
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
