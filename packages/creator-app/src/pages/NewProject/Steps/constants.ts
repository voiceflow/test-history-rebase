import { PlatformType } from '@voiceflow/internal';
import { Icon } from '@voiceflow/ui';
import React from 'react';

import { AmazonInvocationName, DialogflowInvocationName, GoogleInvocationName } from '@/pages/NewProject/DescriptionElements/InvocationName';
import { AmazonLanguage, DialogflowLanguage, GeneralLanguage, GoogleLanguage } from '@/pages/NewProject/DescriptionElements/Languages';
import { createPlatformSelector } from '@/utils/platform';

export enum PlatformFeature {
  DESIGN_AND_PROTO = 'design_and_proto',
  PUBLISH = 'publish',
}

export enum IconType {
  ICON = 'icon',
  IMAGE = 'image,',
}

export interface PlatformMetaType {
  company: string;
  icon?: Icon;
  iconColor?: string;
  platformAppType: string;
  invocationDescription?: React.FC;
  localesDescription?: React.FC;
  localesText?: string;
}

const GENERAL_PLATFORM_META: PlatformMetaType = {
  company: '',
  localesText: 'Language',
  localesDescription: GeneralLanguage,
  icon: 'inFlow',
  iconColor: '#279745',
  platformAppType: 'Assistant',
};

export const getPlatformMeta = createPlatformSelector<PlatformMetaType>({
  [PlatformType.ALEXA]: {
    company: 'Amazon',
    invocationDescription: AmazonInvocationName,
    localesDescription: AmazonLanguage,
    localesText: 'Locales',
    platformAppType: 'Skill',
    icon: 'amazonAlexa',
    iconColor: '#5fcaf4',
  },
  [PlatformType.GOOGLE]: {
    company: 'Google',
    invocationDescription: GoogleInvocationName,
    localesDescription: GoogleLanguage,
    localesText: 'Language',
    platformAppType: 'Action',
    icon: 'googleAssistant',
  },
  [PlatformType.DIALOGFLOW]: {
    company: 'Google',
    invocationDescription: DialogflowInvocationName,
    localesDescription: DialogflowLanguage,
    localesText: 'Language',
    platformAppType: 'Action',
    icon: 'dialogflow',
  },
  [PlatformType.GENERAL]: GENERAL_PLATFORM_META,
  [PlatformType.IVR]: GENERAL_PLATFORM_META,
  [PlatformType.CHATBOT]: GENERAL_PLATFORM_META,
  [PlatformType.MOBILE_APP]: GENERAL_PLATFORM_META,
});

export interface ChannelMetaType {
  name: string;
  description: string;
  features: PlatformFeature[];
  platform: PlatformType;
  icon?: Icon;
  iconColor?: string;
  iconType: IconType;
  iconSize: number;
}

export const getChannelMeta = createPlatformSelector<ChannelMetaType>({
  [PlatformType.ALEXA]: {
    platform: PlatformType.ALEXA,
    name: 'Amazon Alexa',
    description: 'Design, prototype and publish Alexa Skills for Amazon Alexa.',
    features: [PlatformFeature.DESIGN_AND_PROTO, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    icon: 'amazonAlexa',
    iconColor: '#5fcaf4',
    iconSize: 26,
  },
  [PlatformType.GOOGLE]: {
    platform: PlatformType.GOOGLE,
    name: 'Google Assistant',
    description: 'Design, prototype and publish Google Actions for Google Assistant.',
    features: [PlatformFeature.DESIGN_AND_PROTO, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    icon: 'googleAssistant',
    iconSize: 24,
  },
  [PlatformType.DIALOGFLOW]: {
    platform: PlatformType.DIALOGFLOW,
    name: 'Dialogflow',
    description: 'Design, prototype and publish for Google Dialogflow.',
    features: [PlatformFeature.DESIGN_AND_PROTO, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    icon: 'dialogflow',
    iconSize: 24,
  },
  [PlatformType.GENERAL]: {
    platform: PlatformType.GENERAL,
    name: 'Custom Assistant',
    description: 'Design, prototype and export for any conversational channel.',
    features: [PlatformFeature.DESIGN_AND_PROTO],
    icon: 'chatBubbles',
    iconColor: '#4f9ed1',
    iconType: IconType.ICON,
    iconSize: 20,
  },
  [PlatformType.IVR]: {
    platform: PlatformType.IVR,
    name: 'IVR',
    description: 'Design, prototype and export a conversational IVR.',
    features: [PlatformFeature.DESIGN_AND_PROTO],
    icon: 'call',
    iconColor: '#5c6bc0',
    iconType: IconType.ICON,
    iconSize: 20,
  },
  [PlatformType.CHATBOT]: {
    platform: PlatformType.CHATBOT,
    name: 'Chatbot',
    description: 'Design, prototype and export a conversational chatbot.',
    features: [PlatformFeature.DESIGN_AND_PROTO],
    icon: 'speak',
    iconColor: '#3a7685',
    iconType: IconType.ICON,
    iconSize: 20,
  },
  [PlatformType.MOBILE_APP]: {
    platform: PlatformType.MOBILE_APP,
    name: 'Mobile App',
    description: 'Design, prototype and export a mobile voice assistant.',
    features: [PlatformFeature.DESIGN_AND_PROTO],
    icon: 'mobile',
    iconColor: '#3a5999',
    iconType: IconType.ICON,
    iconSize: 20,
  },
});

export const PLATFORM_FEATURE_META = {
  [PlatformFeature.DESIGN_AND_PROTO]: {
    name: 'Design & Prototype',
    color: '#5589eb',
    borderColor: { red: 85, green: 137, blue: 235 },
    description: (platform: PlatformType): string => {
      switch (platform) {
        case PlatformType.IVR:
          return 'Design, prototype and share IVR system call flows';
        case PlatformType.CHATBOT:
          return 'Design, prototype and test experiences for web chat or chat applications';
        case PlatformType.MOBILE_APP:
          return 'Design and test In-App Assistant prototypes for Mobile Apps';
        default:
          return platform === PlatformType.GENERAL
            ? 'Design, prototype and share conversations for any channel or custom assistant'
            : `Test in the browser, or on ${platform === PlatformType.ALEXA ? 'an Alexa' : 'a Google'} device`;
      }
    },
  },
  [PlatformFeature.PUBLISH]: {
    name: 'Publish',
    color: '#558b2f',
    borderColor: { red: 85, green: 139, blue: 47 },
    description: (platform: PlatformType): string => {
      const platformMeta = getPlatformMeta(platform);

      return `Publish live apps to the ${platformMeta.company} ${platformMeta.platformAppType} store`;
    },
  },
};
