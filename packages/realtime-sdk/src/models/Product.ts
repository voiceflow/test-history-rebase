import { AlexaProduct, Locale, ProductType } from '@voiceflow/alexa-types';
import { MarketPlace, SubscriptionPaymentFrequency } from '@voiceflow/alexa-types/build/project/product';

export interface ProductMarketPlace {
  price: number;
  currency: string;
  releaseDate: string;
  countries: string[];
}

export interface Product {
  id: string;
  skill: string;
  type: ProductType;
  name: string;
  version: '1.0';
  referenceName: string;
  summary: string;
  description: string;
  marketPlaces: Partial<Record<MarketPlace, ProductMarketPlace>>;
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
}

export type DBProduct = AlexaProduct;
