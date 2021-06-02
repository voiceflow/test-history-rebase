import { Locale, ProductType } from '@voiceflow/alexa-types';
import { MarketPlace, SubscriptionPaymentFrequency } from '@voiceflow/alexa-types/build/project/product';

export type Product = {
  id: string;
  skill: string;
  type: ProductType;
  name: string;
  version: '1.0';
  referenceName: string;
  summary: string;
  description: string;
  marketPlaces: Record<MarketPlace, Product.MarketPlace>;
  locales: Locale[];
  phrases: string[];
  keywords: string[];
  purchasableState: string | null;
  smallIconUri: string | null;
  largeIconUri: string | null;
  testingInstructions: string | null;
  cardDescription: string | null;
  subscriptionFrequency: SubscriptionPaymentFrequency | null;
  privacyPolicyUrl: string | null;
  trialPeriodDays: string | null;
  taxCategory: string | null;
  purchasePrompt: string | null;
  purchasePromptVoice: string | null;
};

export namespace Product {
  export type MarketPlace = {
    price: number;
    currency: string;
    releaseDate: string;
    countries: string[];
  };
}

export type DBProduct = {
  id: string;
  name: string;
  skill: string;
  data: {
    type: ProductType;
    version: '1.0';
    referenceName: string;
    privacyAndCompliance: DBProduct.PrivacyAndCompliance;
    publishingInformation: DBProduct.PublishingInformation;
    testingInstructions?: string | null;
    purchasableState?: string;
    subscriptionInformation?: DBProduct.SubscriptionInformation;
  };
};

export namespace DBProduct {
  export type PrivacyAndCompliance = {
    locales: Partial<Record<Locale, LocalePrivacyAndCompliance>>;
  };

  export type LocalePrivacyAndCompliance = {
    privacyPolicyUrl?: string | null;
  };

  export type PublishingInformation = {
    distributionCountries: string[];
    pricing: Record<string, Pricing>;
    taxInformation: {
      category?: string | null;
    };
    locales: Record<Locale, LocalePublishingInformation>;
  };

  export type LocalePublishingInformation = {
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
  };

  export type Pricing = {
    releaseDate: string;
    defaultPriceListing: {
      price: number;
      currency: string;
    };
  };

  export type SubscriptionInformation = {
    subscriptionPaymentFrequency?: SubscriptionPaymentFrequency | null;
    subscriptionTrialPeriodDays?: string | null;
  };
}
