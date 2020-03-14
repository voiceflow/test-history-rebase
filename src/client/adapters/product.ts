import cuid from 'cuid';

import { DBProduct, Product } from '@/models';
import { formatMarketPlaces, getDistributionCountries, parseLocales, parseMarketPlaces } from '@/utils/product';

import { createAdapter } from './utils';

const productAdapter = createAdapter<DBProduct, Product>(
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
    const mergedLocale = parseLocales(publishingInformation.locales, privacyAndCompliance);

    return {
      ...mergedLocale,
      id,
      name,
      skill,
      type,
      version,
      referenceName,
      purchasableState: purchasableState || null,
      marketPlaces: parseMarketPlaces(publishingInformation.pricing, publishingInformation.distributionCountries),
      locales: Object.keys(publishingInformation.locales),
      testingInstructions: testingInstructions || null,
      taxCategory: publishingInformation.taxInformation.category || null,
      subscriptionFrequency: subscriptionInformation.subscriptionPaymentFrequency || null,
      trialPeriodDays: subscriptionInformation.subscriptionTrialPeriodDays || null,
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
        pricing: formatMarketPlaces(marketPlaces),
        taxInformation: {
          category: taxCategory,
        },
        locales: locales.reduce<Record<string, DBProduct.LocalePublishingInformation>>((acc, locale) => {
          acc[locale] = {
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
          };

          return acc;
        }, {}),
      },
      privacyAndCompliance: {
        locales: locales.reduce<Record<string, DBProduct.LocalePrivacyAndCompliance>>((acc, locale) => {
          acc[locale] = { privacyPolicyUrl };

          return acc;
        }, {}),
      },
      testingInstructions,
      purchasableState: 'PURCHASABLE',
    },
  })
);

export default productAdapter;
