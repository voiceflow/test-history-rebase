import { Locale, ProductType, PublishingLocale } from '@voiceflow/alexa-types';
import cuid from 'cuid';

import { DBProduct, Product } from '../../models';
import { createAdapter } from '../utils';
import { formatMarketPlaces, getDistributionCountries, parseLocales, parseMarketPlaces } from './utils';

const productAdapter = createAdapter<DBProduct, Product>(
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
      locales: Object.keys(publishingInformation.locales) as Locale[],
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
    referenceName: referenceName || `${name.split(' ').join('_')}_${cuid.slug()}`,
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
      locales: locales.reduce<Partial<Record<Locale, PublishingLocale>>>((acc, locale) => {
        const publishLocal: PublishingLocale = {
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
      type === ProductType.SUBSCRIPTION && subscriptionFrequency
        ? {
            subscriptionTrialPeriodDays: trialPeriodDays ? +trialPeriodDays : 0,
            subscriptionPaymentFrequency: subscriptionFrequency,
          }
        : undefined,
  })
);

export default productAdapter;
