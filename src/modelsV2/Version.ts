import { Version } from '@voiceflow/api-sdk';

import { DBIntent } from '@/models/Intent';
import { DBSlot } from '@/models/Slot';

export type AlexaPlatformData = {
  slots: DBSlot[];
  intents: DBIntent[];

  settings: {
    restart?: boolean;
    repeat?: number;
    events?: string;
    interfaces?: string[];
    permissions?: string[];
    accountLinking?: {
      scopes?: string[] | string[][];
      domains?: string[] | string[][];
      clientSecret?: string;
      accessTokenUrl?: string;
      authorizationUrl?: string;
      defaultTokenExpirationInSeconds?: string;
    };
    customInterface?: boolean;
  };

  publishing: {
    name: string;
    forExport?: boolean;
    hasAds?: boolean;
    summary: string;
    locales: string[];
    category?: string;
    personal?: boolean;
    keywords?: string;
    smallIcon?: string;
    largeIcon?: string;
    description: string;
    invocations?: string[];
    hasPurchase?: boolean;
    forChildren?: boolean;
    instructions?: string;
    privacyPolicy?: string;
    invocationName: string;
    termsAndConditions?: string;
    updatesDescription?: string;
  };

  status: {
    stage: 'DEV' | 'LIVE' | 'REVIEW';
  };
};

export type AlexaVersion = Version<AlexaPlatformData>;
