import moment from 'moment';

import { ProductType } from '@/constants';
import { MarketPlaceAvailability } from '@/services/LocaleMap';

// app to db

export const getDistributionCountries = (marketPlaces) =>
  Object.keys(marketPlaces)
    .map((place) => marketPlaces[place].countries)
    .reduce((a, b) => a.concat(b), []);

export const formatMarketPlaces = (marketPlaces) => {
  // find any valid release date
  const generalReleaseDate = Object.values(marketPlaces).find((place) => !!place?.releaseDate)?.releaseDate || moment().format('YYYY-MM-DD');

  return Object.keys(marketPlaces).reduce(
    (acc, place) => ({
      ...acc,
      [place]: {
        releaseDate: marketPlaces[place].releaseDate || generalReleaseDate,
        defaultPriceListing: {
          price: marketPlaces[place].price,
          currency: marketPlaces[place].currency,
        },
      },
    }),
    {}
  );
};

// db to app

export const parseMarketPlaces = (allPlaces, distributionCountries) =>
  Object.keys(allPlaces).reduce(
    (acc, place) => ({
      ...acc,
      [place]: {
        ...allPlaces[place].defaultPriceListing,
        releaseDate: allPlaces[place].releaseDate,
        countries: MarketPlaceAvailability.find(({ marketPlace }) => marketPlace === place).countries.filter((country) =>
          distributionCountries.includes(country)
        ),
      },
    }),
    {}
  );

export const parseLocals = (locales, privacyAndCompliance) =>
  Object.keys(locales).reduce(
    (acc, locale) => ({
      ...acc,
      summary: locales[locale].summary,
      smallIconUri: locales[locale].smallIconUri,
      largeIconUri: locales[locale].largeIconUri,
      description: locales[locale].description,
      phrases: locales[locale].examplePhrases,
      keywords: locales[locale].keywords,
      cardDescription: locales[locale].customProductPrompts.boughtCardDescription,
      purchasePrompt: locales[locale].customProductPrompts.purchasePromptDescription,
      privacyPolicyUrl: privacyAndCompliance.locales[locale].privacyPolicyUrl,
    }),
    {}
  );

// product status check

export const getMissingDataInfo = (product) => {
  const missingInfo = [];

  !product.summary && missingInfo.push('Short description is required');
  !product.description && missingInfo.push('Detailed description is missing');
  !product.taxCategory && missingInfo.push('Tax category is missing');
  !product.smallIconUri && missingInfo.push('Small icon is missing');
  !product.largeIconUri && missingInfo.push('Large icon is missing');
  !product.phrases.length === 0 && missingInfo.push('Add atleast one phrase');
  !product.keywords && missingInfo.push('Keywords are missing');
  !product.cardDescription && missingInfo.push('In-App card description is missing');
  !product.purchasePrompt && missingInfo.push('Purchase Prompt description is missing');
  !product.privacyPolicyUrl && missingInfo.push('Privacy policy URL is missing');
  !product.testingInstructions && missingInfo.push('Testing Information is missing');

  // marketplace
  Object.keys(product.marketPlaces).length === 0 && missingInfo.push('Atleast one marketplace is required');

  // pricing and countries
  Object.keys(product.marketPlaces).length > 0 &&
    Object.keys(product.marketPlaces).map(
      (place) => product.marketPlaces[place].countries.length === 0 && missingInfo.push(`Please select atleast one country for ${place}`)
    );
  Object.keys(product.marketPlaces).length > 0 &&
    Object.keys(product.marketPlaces).map(
      (place) => product.marketPlaces[place].price === 0 && missingInfo.push(`Please add minimum pricing value for ${place}`)
    );

  return missingInfo;
};

export const isProductComplete = (product) => {
  const missingInfo = getMissingDataInfo(product);
  const isComplete = !!(
    product.name &&
    product.type &&
    product.testingInstructions &&
    product.taxCategory &&
    Object.keys(product.marketPlaces).length > 0 &&
    Object.keys(product.marketPlaces).filter((place) => product.marketPlaces[place].countries.length === 0).length === 0 &&
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

  if (product.type === ProductType.SUBSCRIPTION) {
    return { isComplete: isComplete && product.subscriptionFrequency && product.trialPeriodDays, missingInfo };
  }

  return { isComplete, missingInfo };
};
