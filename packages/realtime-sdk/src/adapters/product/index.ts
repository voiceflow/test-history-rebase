import { DBProduct, Product } from '@realtime-sdk/models';
import { AlexaConstants, AlexaProject } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter } from 'bidirectional-adapter';

import { formatMarketPlaces, getDistributionCountries, parseLocales, parseMarketPlaces } from './utils';

const productAdapter = createMultiAdapter<DBProduct, Product>(
  // db to app
  ({
    name,
    type,
    version,
    productID,
    referenceName,
    purchasableState,
    testingInstructions,
    privacyAndCompliance,
    publishingInformation,
    subscriptionInformation,
  }) => {
    const mergedLocale = parseLocales(publishingInformation.locales, privacyAndCompliance);

    return {
      ...mergedLocale,
      id: productID,
      name,
      type,
      skill: '', // TODO: remove after type will be updated
      version,
      locales: Object.keys(publishingInformation.locales) as AlexaConstants.Locale[],
      marketPlaces: parseMarketPlaces(publishingInformation.pricing, publishingInformation.distributionCountries),
      taxCategory: publishingInformation.taxInformation.category || null,
      referenceName,
      trialPeriodDays: subscriptionInformation?.subscriptionTrialPeriodDays ? String(subscriptionInformation?.subscriptionTrialPeriodDays) : null,
      purchasableState: purchasableState || null,
      testingInstructions: testingInstructions || null,
      subscriptionFrequency: subscriptionInformation?.subscriptionPaymentFrequency || null,
    };
  },
  // app to db
  ({
    id,
    name,
    type,
    summary,
    version,
    locales,
    phrases,
    keywords,
    description,
    taxCategory,
    smallIconUri,
    largeIconUri,
    marketPlaces,
    referenceName,
    purchasePrompt,
    cardDescription,
    trialPeriodDays,
    privacyPolicyUrl,
    testingInstructions,
    subscriptionFrequency,
  }) => ({
    name,
    type,
    version,
    productID: id as string,
    referenceName: referenceName || `${name.split(' ').join('_')}_${Utils.id.cuid.slug()}`,
    purchasableState: 'PURCHASABLE',
    testingInstructions: testingInstructions || '',
    privacyAndCompliance: {
      locales: locales.reduce<DBProduct['privacyAndCompliance']['locales']>(
        (acc, locale) => Object.assign(acc, { [locale]: { privacyPolicyUrl: privacyPolicyUrl?.trim() ?? '' } }),
        {}
      ),
    },
    publishingInformation: {
      pricing: formatMarketPlaces(marketPlaces),
      taxInformation: { category: taxCategory ?? '' },
      distributionCountries: getDistributionCountries(marketPlaces),
      locales: locales.reduce<Partial<Record<AlexaConstants.Locale, AlexaProject.PublishingLocale>>>((acc, locale) => {
        const publishLocal: AlexaProject.PublishingLocale = {
          name,
          summary,
          keywords,
          description,
          smallIconUri: smallIconUri || '',
          largeIconUri: largeIconUri || '',
          examplePhrases: phrases,
          customProductPrompts: {
            boughtCardDescription: cardDescription || '',
            purchasePromptDescription: purchasePrompt || '',
          },
        };

        return Object.assign(acc, { [locale]: publishLocal });
      }, {}),
    },
    subscriptionInformation:
      type === AlexaConstants.ProductType.SUBSCRIPTION && subscriptionFrequency
        ? {
            subscriptionTrialPeriodDays: trialPeriodDays ? +trialPeriodDays : 0,
            subscriptionPaymentFrequency: subscriptionFrequency,
          }
        : undefined,
  })
);

export default productAdapter;
