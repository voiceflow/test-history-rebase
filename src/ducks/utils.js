import moment from 'moment';

import Locales, { MarketPlaceAvailability } from '@/services/LocaleMap';

import { DEFAULT_PHRASE, NEW_PRODUCT_ID } from './product';

export const convertArryToObject = (r, c) => Object.assign(r, c);

export const isProductComplete = ({
  name,
  type,
  testingInstructions,
  taxCategory,
  marketPlaces,
  locales,
  subscriptionFrequency,
  trialPeriodDays,
}) => {
  const locale = Object.keys(locales)[0];
  const missingInfo = [];

  !name && missingInfo.push('Name of the product is required');
  !locales[locale].summary && missingInfo.push('Short Description is required ');
  !locales[locale].description && missingInfo.push('Detailed Description is required ');
  !locales[locale].smallIconUri && missingInfo.push('Small Icon is missing');
  !locales[locale].largeIconUri && missingInfo.push('Large Icon is missing');
  !type && missingInfo.push('Type of the purchase is required');
  !testingInstructions && missingInfo.push('Testing Information is missing');
  !taxCategory && missingInfo.push('Tax Category is required');
  locales[locale].phrases.length === 0 && missingInfo.push('Phrases are missing');
  (!locales[locale].keywords || locales[locale].keywords.length === 0) && missingInfo.push('Atleast one keyword is required');
  !locales[locale].cardDescription && missingInfo.push('In-App card description is missing');
  !locales[locale].purchasePrompt && missingInfo.push('Purchase Prompt is missing');
  !locales[locale].privacyPolicyUrl && missingInfo.push('Privacy policy URL is missing');
  Object.keys(marketPlaces).length === 0 && missingInfo.push('Atleast one marketplace is required');
  Object.keys(marketPlaces).length > 0 &&
    Object.keys(marketPlaces).map(
      (place) => marketPlaces[place].countries.length === 0 && missingInfo.push(`Please select atleast one country for ${place}`)
    );
  Object.keys(marketPlaces).length > 0 &&
    Object.keys(marketPlaces).map((place) => marketPlaces[place].price === 0 && missingInfo.push(`Please add minimum pricing value for ${place}`));

  const isComplete = !!(
    name &&
    type &&
    testingInstructions &&
    taxCategory &&
    Object.keys(marketPlaces).length > 0 &&
    Object.keys(marketPlaces).filter((place) => marketPlaces[place].countries.length === 0).length === 0 &&
    Object.keys(locales).length > 0 &&
    locales[locale].summary &&
    locales[locale].smallIconUri &&
    locales[locale].largeIconUri &&
    locales[locale].description &&
    locales[locale].phrases.length > 0 &&
    locales[locale].keywords &&
    locales[locale].keywords.length > 0 &&
    locales[locale].cardDescription &&
    locales[locale].purchasePrompt &&
    locales[locale].privacyPolicyUrl
  );

  if (type === 'SUBSCRIPTION') {
    return { isComplete: isComplete && subscriptionFrequency && trialPeriodDays, missingInfo };
  }
  return { isComplete, missingInfo };
};

// ----------------- default values----------------

export const getDefaultAvailability = () =>
  MarketPlaceAvailability.map(({ marketPlace, currency, min, countries }) => {
    return {
      [marketPlace]: {
        countries,
        currency,
        price: min,
      },
    };
  }).reduce(convertArryToObject, {});

export const createNewProduct = (locale) => {
  return {
    id: NEW_PRODUCT_ID,
    version: '1.0',
    type: 'ENTITLEMENT',
    name: '',
    marketPlaces: getDefaultAvailability(),
    locales: {
      [locale]: {
        phrases: [DEFAULT_PHRASE],
      },
    },
  };
};

// ---------------- format product object FOR api -------------//

export const formatMarketPlaces = (marketPlaces, id) =>
  Object.keys(marketPlaces)
    .map((place) => {
      return {
        [place]: {
          releaseDate: id === NEW_PRODUCT_ID ? moment().format('YYYY-MM-DD') : marketPlaces[place].releaseDate,
          defaultPriceListing: {
            price: marketPlaces[place].price,
            currency: marketPlaces[place].currency,
          },
        },
      };
    })
    .reduce(convertArryToObject, {});

export const getDistributionCountries = (marketPlaces) =>
  Object.keys(marketPlaces)
    .map((place) => marketPlaces[place].countries)
    .reduce((a, b) => a.concat(b), []);

export const getFormattedProduct = (data, skillID) => {
  return {
    id: data.id,
    name: data.name,
    skill: skillID,
    data: {
      version: data.version,
      type: data.type,
      referenceName: `${data.name.split(' ').join('_')}_${Math.random()
        .toString(36)
        .substring(2, 7)}`,
      ...(data.subscriptionFrequency && {
        subscriptionInformation: {
          subscriptionPaymentFrequency: data.subscriptionFrequency,
          subscriptionTrialPeriodDays: data.trialPeriodDays,
        },
      }),
      publishingInformation: {
        distributionCountries: getDistributionCountries(data.marketPlaces),
        pricing: formatMarketPlaces(data.marketPlaces, data.id),
        taxInformation: {
          category: data.taxCategory,
        },
        locales: Object.keys(data.locales)
          .map((locale) => {
            return {
              [locale]: {
                name: data.name,
                smallIconUri: data.locales[locale].smallIconUri,
                largeIconUri: data.locales[locale].largeIconUri,
                summary: data.locales[locale].summary,
                description: data.locales[locale].description,
                examplePhrases: data.locales[locale].phrases,
                keywords: data.locales[locale].keywords,
                customProductPrompts: {
                  boughtCardDescription: data.locales[locale].cardDescription,
                  purchasePromptDescription: data.locales[locale].purchasePrompt,
                },
              },
            };
          })
          .reduce(convertArryToObject, {}),
      },
      privacyAndCompliance: data.locales
        ? {
            locales: Object.keys(data.locales)
              .map((locale) => {
                return {
                  [locale]: {
                    privacyPolicyUrl: data.locales[locale].privacyPolicyUrl,
                  },
                };
              })
              .reduce(convertArryToObject, {}),
          }
        : {},
      testingInstructions: data.testingInstructions,
      purchasableState: 'PURCHASABLE',
    },
  };
};

// ---------------- parse product object FROM api ------------------- //

const parseMarketPlaces = (allPlaces, distributionCountries) =>
  Object.keys(allPlaces)
    .map((place) => {
      return {
        [place]: {
          ...allPlaces[place].defaultPriceListing,
          releaseDate: allPlaces[place].releaseDate,
          countries: MarketPlaceAvailability.find(({ marketPlace }) => marketPlace === place).countries.filter((country) =>
            distributionCountries.includes(country)
          ),
        },
      };
    })
    .reduce(convertArryToObject, {});

const parseLocals = (locales, privacyAndCompliance) =>
  Object.keys(locales)
    .map((locale) => {
      return {
        [locale]: {
          summary: locales[locale].summary,
          smallIconUri: locales[locale].smallIconUri,
          largeIconUri: locales[locale].largeIconUri,
          description: locales[locale].description,
          phrases: locales[locale].examplePhrases,
          keywords: locales[locale].keywords,
          cardDescription: locales[locale].customProductPrompts.boughtCardDescription,
          purchasePrompt: locales[locale].customProductPrompts.purchasePromptDescription,
          privacyPolicyUrl: privacyAndCompliance.locales[locale].privacyPolicyUrl,
        },
      };
    })
    .reduce(convertArryToObject, {});

export const parseProduct = ({
  id,
  name,
  data: { version, type, privacyAndCompliance, publishingInformation, testingInstructions, purchasableState, subscriptionInformation = {} },
}) => {
  return {
    id,
    name,
    version,
    type,
    purchasableState,
    testingInstructions,
    taxCategory: publishingInformation.taxInformation.category,
    subscriptionFrequency: subscriptionInformation.subscriptionPaymentFrequency,
    trialPeriodDays: subscriptionInformation.subscriptionTrialPeriodDays,
    marketPlaces: parseMarketPlaces(publishingInformation.pricing, publishingInformation.distributionCountries),
    locales: parseLocals(publishingInformation.locales, privacyAndCompliance),
  };
};

// ---------------------- normalization ----------------

export const getSelectedLocales = (locales = []) => Locales.filter(({ value, inSkillProduct }) => locales.includes(value) && inSkillProduct);

// duplicates default locale - 'en-US' to all ISP supported locales
export const normalizeProductLocale = (product, locales) => {
  const locale = getSelectedLocales(locales)[0].value;

  return {
    ...product,
    locales: getSelectedLocales(locales)
      .map(({ value }) => {
        return {
          [value]: product.locales[locale],
        };
      })
      .reduce(convertArryToObject, {}),
    ...(product.id === NEW_PRODUCT_ID && {
      marketPlaces: Object.keys(product.marketPlaces)
        .map((place) => {
          return { [place]: { ...product.marketPlaces[place], releaseDate: moment().format('YYYY-MM-DD') } };
        })
        .reduce(convertArryToObject, {}),
    }),
  };
};
