import { Constants, Project } from '@voiceflow/alexa-types';

export type { DBProduct, Product, ProductMarketPlace } from '@voiceflow/realtime-sdk';

export namespace DBProduct {
  export interface PrivacyAndCompliance {
    locales: Partial<Record<Constants.Locale, LocalePrivacyAndCompliance>>;
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
    locales: Record<Constants.Locale, LocalePublishingInformation>;
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
    subscriptionPaymentFrequency?: Project.SubscriptionPaymentFrequency | null;
    subscriptionTrialPeriodDays?: string | null;
  }
}
