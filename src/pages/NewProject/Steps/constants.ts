import React from 'react';

import { PlatformType } from '@/constants';
import { AmazonInvocationName, GoogleInvocationName } from '@/pages/NewProject/DescriptionElements/InvocationName';
import { AmazonLanguage, GoogleLanguage } from '@/pages/NewProject/DescriptionElements/Languages';
import { Icon } from '@/svgs/types';

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
    borderColor: { red: 85, green: 137, blue: 235 },
    description: (platform: PlatformType) =>
      platform === PlatformType.GENERAL
        ? 'Design, prototype and share conversations for any channel or custom assistant'
        : `Test in the browser, or on a ${platform} device`,
  },
  [PlatformFeature.PUBLISH]: {
    name: 'Publish',
    color: '#558b2f',
    borderColor: { red: 85, green: 139, blue: 47 },
    description: (platform: PlatformType) =>
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
  platform: PlatformType;
  platformName: PlatformType;
  invocationDescription?: React.FC;
  localesDescription?: React.FC;
  localesText?: string;
  platformAppType: string;
  iconType: IconType;
  iconSize: number;
};

export type PlatformMetaProps = Record<PlatformType, PlatformMetaType>;

export const PLATFORM_META: PlatformMetaProps = {
  [PlatformType.ALEXA]: {
    name: 'Amazon Alexa',
    company: 'Amazon',
    description: 'Design, prototype and publish Alexa Skills for Amazon Alexa.',
    // eslint-disable-next-line lodash/prefer-constant
    invocationDescription: AmazonInvocationName,
    localesDescription: AmazonLanguage,
    localesText: 'Locales',
    features: [PlatformFeature.DESIGN_AND_PROTO, PlatformFeature.PUBLISH],
    platformName: PlatformType.ALEXA,
    platform: PlatformType.ALEXA,
    platformAppType: 'Skill',
    iconType: IconType.ICON,
    icon: 'amazonAlexa',
    iconColor: '#5fcaf4',
    iconSize: 28,
  },
  [PlatformType.GOOGLE]: {
    name: 'Google Assistant',
    company: 'Google',
    description: 'Design, prototype and publish Google Actions for Google Assistant.',
    invocationDescription: GoogleInvocationName,
    localesDescription: GoogleLanguage,
    localesText: 'Language',
    features: [PlatformFeature.DESIGN_AND_PROTO, PlatformFeature.PUBLISH],
    platformName: PlatformType.GOOGLE,
    platform: PlatformType.GOOGLE,
    platformAppType: 'Action',
    iconType: IconType.ICON,
    icon: 'googleAssistant',
    iconSize: 26,
  },
  [PlatformType.GENERAL]: {
    name: 'General Assistant',
    company: '',
    description: 'Design, prototype and share conversational apps and dialogs.',
    features: [PlatformFeature.DESIGN_AND_PROTO],
    icon: 'speak',
    iconColor: 'rgba(110, 132, 154, 0.75)',
    platformAppType: '',
    platformName: PlatformType.GENERAL,
    platform: PlatformType.GENERAL,
    iconType: IconType.ICON,
    iconSize: 22,
  },
};

export const PLATFORM_META_ARRAY = [PLATFORM_META[PlatformType.ALEXA], PLATFORM_META[PlatformType.GOOGLE], PLATFORM_META[PlatformType.GENERAL]];
