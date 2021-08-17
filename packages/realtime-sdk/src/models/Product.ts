import { Constants, Project } from '@voiceflow/alexa-types';

export interface ProductMarketPlace {
  price: number;
  currency: string;
  releaseDate: string;
  countries: string[];
}

export interface Product {
  id: string;
  skill: string;
  type: Constants.ProductType;
  name: string;
  version: '1.0';
  referenceName: string;
  summary: string;
  description: string;
  marketPlaces: Partial<Record<Project.MarketPlace, ProductMarketPlace>>;
  locales: Constants.Locale[];
  phrases: string[];
  keywords: string[];
  purchasableState: string | null;
  smallIconUri: string | null;
  largeIconUri: string | null;
  testingInstructions: string | null;
  cardDescription: string | null;
  subscriptionFrequency: Project.SubscriptionPaymentFrequency | null;
  privacyPolicyUrl: string | null;
  trialPeriodDays: string | null;
  taxCategory: string | null;
  purchasePrompt: string | null;
}

export type DBProduct = Project.AlexaProduct;
