import React from 'react';

import { AmazonInvocationName, GoogleInvocationName } from '@/pages/NewProject/DescriptionElements/InvocationName';
import { AmazonLanguage, GoogleLanguage } from '@/pages/NewProject/DescriptionElements/Languages';
import { Icon } from '@/svgs/types';

export enum Platform {
  ALEXA = 'Alexa',
  GOOGLE = 'Google',
  GENERAL = 'General',
}

export enum PlatformFeature {
  DESIGN_AND_PROTO = 'design_and_proto',
  PUBLISH = 'publish',
}

export enum IconType {
  ICON = 'icon',
  IMAGE = 'image,',
}

export const PLATFORM_FEATURE_META = {
  [PlatformFeature.DESIGN_AND_PROTO]: {
    name: 'Design & Prototype',
    color: '#5589eb',
    borderColor: 'rgb(85 137 235 / 30%)',
    description: (platform: Platform) =>
      platform === Platform.GENERAL
        ? 'Design, prototype and share conversations for any channel or custom assistant'
        : `Test in the browser, or on a ${platform} device`,
  },
  [PlatformFeature.PUBLISH]: {
    name: 'Publish',
    color: '#558b2f',
    borderColor: 'rgb(85 139 47 / 30%)',
    description: (platform: Platform) =>
      `Publish live apps to the ${PLATFORM_META[platform].company} ${PLATFORM_META[platform].platformAppType} store`,
  },
};

export type PlatformMetaType = {
  name: string;
  description: string;
  company: string;
  features: PlatformFeature[];
  icon?: Icon;
  iconColor?: string;
  platform: Platform;
  platformName: Platform;
  invocationDescription?: React.FC;
  localesDescription?: React.FC;
  localesText?: string;
  platformAppType: string;
  iconType: IconType;
  iconSize: number;
};

export type PlatformMetaProps = Record<Platform, PlatformMetaType>;

export const PLATFORM_META: PlatformMetaProps = {
  [Platform.ALEXA]: {
    name: 'Amazon Alexa',
    company: 'Amazon',
    description: 'Design, prototype and publish Alexa Skills for Amazon Alexa.',
    // eslint-disable-next-line lodash/prefer-constant
    invocationDescription: AmazonInvocationName,
    localesDescription: AmazonLanguage,
    localesText: 'Locales',
    features: [PlatformFeature.DESIGN_AND_PROTO, PlatformFeature.PUBLISH],
    platformName: Platform.ALEXA,
    platform: Platform.ALEXA,
    platformAppType: 'Skill',
    iconType: IconType.ICON,
    icon: 'amazonAlexa',
    iconSize: 28,
  },
  [Platform.GOOGLE]: {
    name: 'Google Assistant',
    company: 'Google',
    description: 'Design, prototype and publish Google Actions for Google Assistant.',
    invocationDescription: GoogleInvocationName,
    localesDescription: GoogleLanguage,
    localesText: 'Languages',
    features: [PlatformFeature.DESIGN_AND_PROTO, PlatformFeature.PUBLISH],
    platformName: Platform.GOOGLE,
    platform: Platform.GOOGLE,
    platformAppType: 'Action',
    iconType: IconType.ICON,
    icon: 'googleAssistant',
    iconSize: 26,
  },
  [Platform.GENERAL]: {
    name: 'General Assistant',
    company: '',
    description: 'Design, prototype and share conversational apps and dialogs.',
    features: [PlatformFeature.DESIGN_AND_PROTO],
    icon: 'speak',
    iconColor: 'rgba(110, 132, 154, 0.75)',
    platformAppType: '',
    platformName: Platform.GENERAL,
    platform: Platform.GENERAL,
    iconType: IconType.ICON,
    iconSize: 22,
  },
};

export const PLATFORM_META_ARRAY = [PLATFORM_META[Platform.ALEXA], PLATFORM_META[Platform.GOOGLE], PLATFORM_META[Platform.GENERAL]];
