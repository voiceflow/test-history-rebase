import { PlatformType } from '@/constants';

import { DBIntent } from './Intent';
import { DBSlot } from './Slot';

export type Skill = {
  name: string;
  id: string;
  locales: string[];
  creatorID: number;
  projectID: string;
  rootDiagramID: string;
  diagramID: string;
  platform: PlatformType;
  globalVariables: string[];
};

export type DBSkill = {
  name: string;
  skill_id: string;
  creator_id: number;
  project_id: string;
  diagram: string;
  platform: PlatformType;
  live: boolean;
  review: boolean;
  locales: string[];
  google_publish_info: unknown;
  global?: string[];
  amzn_id?: string;
  vendor_id: string | null;
  google_id: string | null;
  intents: DBIntent[];
  slots: DBSlot[];
};

export type ToDBSkill = Omit<DBSkill, 'intents' | 'slots'> & {
  intents: string;
  slots: string;
};

export type FullSkill = Skill & {
  publishInfo: {
    [PlatformType.GOOGLE]: {
      googleId: null | string;
    };
    [PlatformType.ALEXA]: {
      amznID: string | null;
      vendorId: string | null;
      review: boolean;
      live: boolean;
    };
  };
  meta: Partial<{
    created: string;
    summary: string;
    description: string;
    keywords: string;
    invocations: {
      value: string[];
    };
    category: string | null;
    purchase: boolean;
    personal: boolean;
    copa: boolean;
    ads: boolean;
    export: boolean;
    instructions: string;
    stage: number;
    restart: boolean;
    preview: boolean;
    fulfillment: any;
    access_token_variable: null;
    alexa_permissions: null;
    alexa_interfaces: null;
    repeat: number;
    google_versions: any;
    settings: any;
    invName: string;
    smallIcon: string;
    largeIcon: string;
    resumePrompt: any;
    errorPrompt: any;
    alexaEvents: string;
    accountLinking: any;
    privacyPolicy: string;
    termsAndCond: string;
    updatesDescription: string;
  }>;
};
