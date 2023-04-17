import { AlexaConstants, AlexaProject } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import dayjs from 'dayjs';

import { MarketPlaceAvailability } from '@/services/LocaleMap';

export type MergedLocale = Pick<
  Realtime.Product,
  'summary' | 'description' | 'smallIconUri' | 'largeIconUri' | 'phrases' | 'keywords' | 'cardDescription' | 'purchasePrompt' | 'privacyPolicyUrl'
> & {
  purchasePromptVoice: string | null;
};

// app to db

export const getDistributionCountries = (marketPlaces: Record<string, Realtime.ProductMarketPlace>) =>
  Object.keys(marketPlaces)
    .map((place) => marketPlaces[place].countries)
    .reduce((a, b) => a.concat(b), []);

export const formatMarketPlaces = (marketPlaces: Record<string, Realtime.ProductMarketPlace>) => {
  // find any valid release date
  const generalReleaseDate = Object.values(marketPlaces).find((place) => !!place?.releaseDate)?.releaseDate || dayjs().format('YYYY-MM-DD');

  return Object.keys(marketPlaces).reduce<Record<string, Realtime.DBProduct.Pricing>>((acc, place) => {
    acc[AlexaProject.encodeMarketPlaceKey(place as AlexaProject.MarketPlace)] = {
      releaseDate: marketPlaces[place].releaseDate || generalReleaseDate,
      defaultPriceListing: {
        price: +marketPlaces[place].price || 0,
        currency: marketPlaces[place].currency,
      },
    };

    return acc;
  }, {});
};

// db to app

export const parseMarketPlaces = (
  allPlaces: Partial<Record<string, Realtime.DBProduct.Pricing>>,
  distributionCountries: string[]
): Record<string, Realtime.ProductMarketPlace> =>
  Object.keys(allPlaces).reduce((acc, encodedKey) => {
    const placeKey = AlexaProject.decodeMarketPlaceKey(encodedKey);
    const place = allPlaces[encodedKey];

    return !place
      ? acc
      : Object.assign(acc, {
          [placeKey]: {
            ...place.defaultPriceListing,
            releaseDate: place.releaseDate,
            countries: MarketPlaceAvailability.find(({ marketPlace }) => marketPlace === placeKey)!.countries.filter((country) =>
              distributionCountries.includes(country)
            ),
          },
        });
  }, {});

export const parseLocales = (
  locales: Partial<Record<AlexaConstants.Locale, Realtime.DBProduct.LocalePublishingInformation>>,
  privacyAndCompliance: Realtime.DBProduct.PrivacyAndCompliance
) =>
  (Object.keys(locales) as AlexaConstants.Locale[]).reduce<MergedLocale>((acc, locale) => {
    const localeData = locales[locale];

    return !localeData
      ? acc
      : Object.assign(acc, {
          summary: localeData.summary,
          description: localeData.description,
          phrases: localeData.examplePhrases,
          keywords: localeData.keywords || [],
          smallIconUri: localeData.smallIconUri || null,
          largeIconUri: localeData.largeIconUri || null,
          cardDescription: localeData.customProductPrompts.boughtCardDescription || null,
          purchasePrompt: localeData.customProductPrompts.purchasePromptDescription || null,
          privacyPolicyUrl: privacyAndCompliance.locales[locale]?.privacyPolicyUrl || null,
          purchasePromptVoice: localeData.customProductPrompts.purchasePromptDescriptionVoice || null,
        });
  }, {} as MergedLocale);

// product status check

export const getMissingDataInfo = (product: Realtime.Product) => {
  const missingInfo = [];

  !product.summary && missingInfo.push('Short description is required');
  !product.description && missingInfo.push('Detailed description is missing');
  !product.taxCategory && missingInfo.push('Tax category is missing');
  !product.smallIconUri && missingInfo.push('Small icon is missing');
  !product.largeIconUri && missingInfo.push('Large icon is missing');
  !product.phrases.length && missingInfo.push('Add at least one phrase');
  !product.keywords && missingInfo.push('Keywords are missing');
  !product.cardDescription && missingInfo.push('In-App card description is missing');
  !product.purchasePrompt && missingInfo.push('Purchase Prompt description is missing');
  !product.privacyPolicyUrl && missingInfo.push('Privacy policy URL is missing');
  !product.testingInstructions && missingInfo.push('Testing Information is missing');

  const marketPlacesKeys = Object.keys(product.marketPlaces) as AlexaProject.MarketPlace[];

  // marketplace
  marketPlacesKeys.length === 0 && missingInfo.push('Atleast one marketplace is required');

  // pricing and countries
  marketPlacesKeys.length > 0 &&
    marketPlacesKeys.map(
      (place) => product.marketPlaces[place]!.countries.length === 0 && missingInfo.push(`Please select atleast one country for ${place}`)
    );
  marketPlacesKeys.length > 0 &&
    marketPlacesKeys.map((place) => product.marketPlaces[place]!.price === 0 && missingInfo.push(`Please add minimum pricing value for ${place}`));

  return missingInfo;
};

export const isProductComplete = (product: Realtime.Product) => {
  const missingInfo = getMissingDataInfo(product);
  const isComplete = !!(
    product.name &&
    product.type &&
    product.testingInstructions &&
    product.taxCategory &&
    Object.keys(product.marketPlaces).length > 0 &&
    (Object.keys(product.marketPlaces) as AlexaProject.MarketPlace[]).filter((place) => product.marketPlaces[place]!.countries.length === 0)
      .length === 0 &&
    product.summary &&
    product.smallIconUri &&
    product.largeIconUri &&
    product.description &&
    product.phrases.length > 0 &&
    product.keywords &&
    product.keywords.length > 0 &&
    product.cardDescription &&
    product.purchasePrompt &&
    product.privacyPolicyUrl
  );

  if (product.type === AlexaConstants.ProductType.SUBSCRIPTION) {
    return { isComplete: isComplete && product.subscriptionFrequency && product.trialPeriodDays, missingInfo };
  }

  return { isComplete, missingInfo };
};
