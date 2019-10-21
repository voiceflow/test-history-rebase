import cuid from 'cuid';

import { formatMarketPlaces, getDistributionCountries, parseLocals, parseMarketPlaces } from '@/ducks/utils/product';

import { createAdapter } from './utils';

const productAdapter = createAdapter(
  // db to app
  ({
    id,
    name,
    skill,
    data: {
      type,
      version,
      referenceName,
      testingInstructions,
      purchasableState,
      privacyAndCompliance,
      publishingInformation,
      subscriptionInformation = {},
    },
  }) => {
    const { marketPlaces, releaseDate } = parseMarketPlaces(publishingInformation.pricing, publishingInformation.distributionCountries);
    const { summary, smallIconUri, largeIconUri, description, phrases, keywords, cardDescription, purchasePrompt, privacyPolicyUrl } = parseLocals(
      publishingInformation.locales,
      privacyAndCompliance
    );

    return {
      id,
      name,
      skill,
      type,
      version,
      referenceName,
      releaseDate,
      testingInstructions,
      marketPlaces,
      taxCategory: publishingInformation.taxInformation.category,
      locales: Object.keys(publishingInformation.locales),
      smallIconUri,
      largeIconUri,
      summary,
      description,
      phrases,
      keywords,
      cardDescription,
      purchasePrompt,
      purchasableState,
      subscriptionFrequency: subscriptionInformation.subscriptionPaymentFrequency,
      trialPeriodDays: subscriptionInformation.subscriptionTrialPeriodDays,
      privacyPolicyUrl,
    };
  },
  // app to db
  ({
    id,
    skill,
    version,
    referenceName,

    name,
    summary,
    description,

    type,
    subscriptionFrequency,
    trialPeriodDays,
    taxCategory,

    releaseDate,
    marketPlaces,

    locales,

    smallIconUri,
    largeIconUri,

    phrases,

    keywords,
    cardDescription,
    purchasePrompt,
    privacyPolicyUrl,
    testingInstructions,
  }) => ({
    id,
    name,
    skill,
    data: {
      type,
      version,
      referenceName: referenceName || `${name.split(' ').join('_')}_${cuid.slug()}`,
      ...(subscriptionFrequency && {
        subscriptionInformation: {
          subscriptionPaymentFrequency: subscriptionFrequency,
          subscriptionTrialPeriodDays: trialPeriodDays,
        },
      }),
      publishingInformation: {
        distributionCountries: getDistributionCountries(marketPlaces),
        pricing: formatMarketPlaces(marketPlaces, releaseDate),
        taxInformation: {
          category: taxCategory,
        },
        locales: locales.reduce(
          (acc, locale) => ({
            ...acc,
            [locale]: {
              name,
              smallIconUri,
              largeIconUri,
              summary,
              description,
              keywords,
              examplePhrases: phrases,
              customProductPrompts: {
                boughtCardDescription: cardDescription,
                purchasePromptDescription: purchasePrompt,
              },
            },
          }),
          {}
        ),
      },
      privacyAndCompliance: {
        locales: locales.reduce((acc, locale) => {
          return {
            ...acc,
            [locale]: {
              privacyPolicyUrl,
            },
          };
        }, {}),
      },
      testingInstructions,
      purchasableState: 'PURCHASABLE',
    },
  })
);

export default productAdapter;
