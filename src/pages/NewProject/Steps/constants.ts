import React from 'react';

import { ChannelType, PlatformType } from '@/constants';
import { AmazonInvocationName, GoogleInvocationName } from '@/pages/NewProject/DescriptionElements/InvocationName';
import { AmazonLanguage, GeneralLanguage, GoogleLanguage } from '@/pages/NewProject/DescriptionElements/Languages';
import { Icon } from '@/svgs/types';

export enum PlatformFeature {
  DESIGN_AND_PROTO = 'design_and_proto',
  PUBLISH = 'publish',
}

export enum IconType {
  ICON = 'icon',
  IMAGE = 'image,',
}

export type PlatformMetaType = {
  company: string;
  icon?: Icon;
  iconColor?: string;
  platformAppType: string;
  invocationDescription?: React.FC;
  localesDescription?: React.FC;
  localesText?: string;
};

export const PLATFORM_META: Record<PlatformType, PlatformMetaType> = {
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
  [PlatformType.GENERAL]: {
    company: '',
    localesText: 'Language',
    localesDescription: GeneralLanguage,
    icon: 'speak',
    iconColor: '#6E849A',
    platformAppType: 'Assistant',
  },
};

export type ChannelMetaType = {
  name: string;
  description: string;
  features: PlatformFeature[];
  icon?: Icon;
  iconColor?: string;
  channel: ChannelType;
  platform: PlatformType;
  iconType: IconType;
  iconSize: number;
};

export const CHANNEL_META: Record<ChannelType, ChannelMetaType> = {
  [ChannelType.ALEXA_ASSISTANT]: {
    name: 'Amazon Alexa',
    description: 'Design, prototype and publish Alexa Skills for Amazon Alexa.',
    features: [PlatformFeature.DESIGN_AND_PROTO, PlatformFeature.PUBLISH],
    platform: PlatformType.ALEXA,
    channel: ChannelType.ALEXA_ASSISTANT,
    iconType: IconType.ICON,
    icon: 'amazonAlexa',
    iconColor: '#5fcaf4',
    iconSize: 28,
  },
  [ChannelType.GOOGLE_ASSISTANT]: {
    name: 'Google Assistant',
    description: 'Design, prototype and publish Google Actions for Google Assistant.',
    features: [PlatformFeature.DESIGN_AND_PROTO, PlatformFeature.PUBLISH],
    platform: PlatformType.GOOGLE,
    channel: ChannelType.GOOGLE_ASSISTANT,
    iconType: IconType.ICON,
    icon: 'googleAssistant',
    iconSize: 26,
  },
  [ChannelType.CUSTOM_ASSISTANT]: {
    name: 'Custom Assistant',
    description: 'Design, prototype and export for any conversational channel.',
    features: [PlatformFeature.DESIGN_AND_PROTO],
    icon: 'smile',
    iconColor: '#4f9ed1',
    platform: PlatformType.GENERAL,
    channel: ChannelType.CUSTOM_ASSISTANT,
    iconType: IconType.ICON,
    iconSize: 18,
  },
  [ChannelType.IVR]: {
    name: 'IVR',
    description: 'Design, prototype and export a conversational IVR.',
    features: [PlatformFeature.DESIGN_AND_PROTO],
    icon: 'call',
    iconColor: '#5c6bc0',
    platform: PlatformType.GENERAL,
    channel: ChannelType.IVR,
    iconType: IconType.ICON,
    iconSize: 18,
  },
  [ChannelType.CHATBOT]: {
    name: 'Chatbot',
    description: 'Design, prototype and export a conversational chatbot.',
    features: [PlatformFeature.DESIGN_AND_PROTO],
    icon: 'speak',
    iconColor: '#3a7685',
    platform: PlatformType.GENERAL,
    channel: ChannelType.CHATBOT,
    iconType: IconType.ICON,
    iconSize: 18,
  },
  [ChannelType.MOBILE_APP]: {
    name: 'Mobile App',
    description: 'Design, prototype and export a mobile voice assistant.',
    features: [PlatformFeature.DESIGN_AND_PROTO],
    icon: 'mobile',
    iconColor: '#3a5999',
    platform: PlatformType.GENERAL,
    channel: ChannelType.MOBILE_APP,
    iconType: IconType.ICON,
    iconSize: 18,
  },
};

export const PLATFORM_FEATURE_META = {
  [PlatformFeature.DESIGN_AND_PROTO]: {
    name: 'Design & Prototype',
    color: '#5589eb',
    borderColor: { red: 85, green: 137, blue: 235 },
    description: (channel: ChannelType) => {
      switch (channel) {
        case ChannelType.IVR:
          return 'Design, prototype and share IVR system call flows';
        case ChannelType.CHATBOT:
          return 'Design, prototype and test experiences for web chat or chat applications';
        case ChannelType.MOBILE_APP:
          return 'Design and test In-App Assistant prototypes for Mobile Apps';
        default:
          return channel === ChannelType.CUSTOM_ASSISTANT
            ? 'Design, prototype and share conversations for any channel or custom assistant'
            : `Test in the browser, or on ${channel === ChannelType.ALEXA_ASSISTANT ? 'an Alexa' : 'a Google'} device`;
      }
    },
  },
  [PlatformFeature.PUBLISH]: {
    name: 'Publish',
    color: '#558b2f',
    borderColor: { red: 85, green: 139, blue: 47 },
    description: (channel: ChannelType) => {
      const platform = PLATFORM_META[CHANNEL_META[channel].platform];

      return `Publish live apps to the ${platform.company} ${platform.platformAppType} store`;
    },
  },
};
