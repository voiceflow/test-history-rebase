import { Locale } from '@voiceflow/alexa-types';
import { SubscriptionPaymentFrequency } from '@voiceflow/alexa-types/build/project/product';

export type { DBProduct, Product, ProductMarketPlace } from '@voiceflow/realtime-sdk';

export namespace DBProduct {
  export interface PrivacyAndCompliance {
    locales: Partial<Record<Locale, LocalePrivacyAndCompliance>>;
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
    locales: Record<Locale, LocalePublishingInformation>;
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
    subscriptionPaymentFrequency?: SubscriptionPaymentFrequency | null;
    subscriptionTrialPeriodDays?: string | null;
  }
}
