/* eslint-disable @typescript-eslint/no-namespace */
import type { AlexaConstants, AlexaProject } from '@voiceflow/alexa-types';

export interface ProductMarketPlace {
  price: number;
  currency: string;
  releaseDate: string;
  countries: string[];
}

export interface Product {
  id: string;
  skill: string;
  type: AlexaConstants.ProductType;
  name: string;
  version: '1.0';
  referenceName: string;
  summary: string;
  description: string;
  marketPlaces: Partial<Record<AlexaProject.MarketPlace, ProductMarketPlace>>;
  locales: AlexaConstants.Locale[];
  phrases: string[];
  keywords: string[];
  purchasableState: string | null;
  smallIconUri: string | null;
  largeIconUri: string | null;
  testingInstructions: string | null;
  cardDescription: string | null;
  subscriptionFrequency: AlexaProject.SubscriptionPaymentFrequency | null;
  privacyPolicyUrl: string | null;
  trialPeriodDays: string | null;
  taxCategory: string | null;
  purchasePrompt: string | null;

  // TODO: need to support this in the adapter
  consumableUnit?: string | null;
}

export type DBProduct = AlexaProject.Product;

export namespace DBProduct {
  export interface PrivacyAndCompliance {
    locales: Partial<Record<AlexaConstants.Locale, LocalePrivacyAndCompliance>>;
  }

  export interface LocalePrivacyAndCompliance {
    privacyPolicyUrl?: string | null;
  }

  export interface PublishingInformation {
    distributionCountries: string[];
    pricing: Record<string, Pricing>;
    taxInformation: {
      category?: string | null;
    };
    locales: Record<AlexaConstants.Locale, LocalePublishingInformation>;
  }

  export interface LocalePublishingInformation {
    name: string;
    smallIconUri?: string | null;
    largeIconUri?: string | null;
    summary: string;
    description: string;
    keywords: string[];
    examplePhrases: string[];
    customProductPrompts: {
      boughtCardDescription?: string | null;
      purchasePromptDescription?: string | null;
      purchasePromptDescriptionVoice?: string | null;
    };
  }

  export interface Pricing {
    releaseDate: string;
    defaultPriceListing: {
      price: number;
      currency: string;
    };
  }

  export interface SubscriptionInformation {
    subscriptionPaymentFrequency?: AlexaProject.SubscriptionPaymentFrequency | null;
    subscriptionTrialPeriodDays?: string | null;
  }
}
