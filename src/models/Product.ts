export type Product = {
  id: number;
  skill: string;
  type: string;
  name: string;
  version: string;
  referenceName: string;
  summary: string;
  description: string;
  marketPlaces: Record<string, Product.MarketPlace>;
  locales: string[];
  phrases: string[];
  keywords: string[];
  purchasableState: string | null;
  smallIconUri: string | null;
  largeIconUri: string | null;
  testingInstructions: string | null;
  cardDescription: string | null;
  subscriptionFrequency: string | null;
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
  id: number;
  name: string;
  skill: string;
  data: {
    type: string;
    version: string;
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
    locales: Record<string, LocalePrivacyAndCompliance>;
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
    locales: Record<string, LocalePublishingInformation>;
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
    subscriptionPaymentFrequency?: string | null;
    subscriptionTrialPeriodDays?: string | null;
  };
}
