import { ModelSensitivity } from '@voiceflow/alexa-types';

import { PlatformType } from '@/constants';

export type Skill<L extends string> = {
  name: string;
  id: string;
  locales: L[];
  mainLocale?: string;
  creatorID: number;
  projectID: string;
  rootDiagramID: string;
  diagramID: string;
  platform: PlatformType;
  globalVariables: string[];
  smallIcon?: string;
  largeIcon?: string;
  invocation?: string;
};

export type FullSkill<L extends string> = Skill<L> & {
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
  meta: {
    created?: string;
    summary: string;
    description: string;
    keywords: string;
    invocations: string[];
    locales: L[];
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
    alexa_permissions: string[];
    alexa_interfaces: null;
    repeat: number;
    google_versions: any;
    settings: {
      defaultVoice?: null | string;
      customInterface?: boolean;
      modelSensitivity?: null | ModelSensitivity;
    };
    invName: string;
    smallIcon: string;
    largeIcon: string;
    resumePrompt: {
      voice: string;
      content: string;
      follow_content?: string;
      follow_voice?: string;
    };
    errorPrompt: {
      voice: string;
      content: string;
    };
    alexaEvents: string;
    accountLinking: any;
    privacyPolicy: string;
    termsAndCond: string;
    updatesDescription: string;
  };
};
