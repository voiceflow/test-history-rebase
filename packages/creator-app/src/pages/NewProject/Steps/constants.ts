import { Constants } from '@voiceflow/general-types';
import { Icon } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { AmazonInvocationName, DialogflowInvocationName, GoogleInvocationName } from '@/pages/NewProject/DescriptionElements/InvocationName';
import { AmazonLanguage, DialogflowLanguage, GeneralLanguage, GoogleLanguage } from '@/pages/NewProject/DescriptionElements/Languages';
import { createPlatformSelector, getPlatformValue } from '@/utils/platform';

export enum PlatformFeature {
  API = 'api',
  EXPORT = 'export',
  DESIGN = 'design',
  PUBLISH = 'publish',

  /** @deprecated */
  DESIGN_AND_PROTO = 'design_and_proto',
}

export enum IconType {
  ICON = 'icon',
  IMAGE = 'image,',
}

export interface PlatformMetaType {
  icon?: Icon;
  company: string;
  iconColor?: string;
  localesText?: string;
  platformAppType: string;
  settingsTitle: string;
  localesDescription?: React.FC;
  invocationDescription?: React.FC;
}

export interface ChannelMetaType {
  name: string;
  icon: Icon;
  platform: Constants.PlatformType;
  features: PlatformFeature[];
  iconType: IconType;
  iconSize: number;
  iconColor?: string;
  comingSoon?: boolean;
  isNew?: boolean;
  description: string;
  featureFlag?: FeatureFlag;
}

export interface PlatformFeatureMetaType {
  name: string;
  color: string;
  description: string | ((platform: Constants.PlatformType) => string);
}

export interface ProjectSection {
  name: string;
  platforms: Constants.PlatformType[];
}

export const getPlatformMeta = createPlatformSelector<PlatformMetaType>(
  {
    [Constants.PlatformType.ALEXA]: {
      icon: 'amazonAlexa',
      company: 'Amazon',
      iconColor: '#5fcaf4',
      localesText: 'Locales',
      platformAppType: 'Skill',
      settingsTitle: 'Skill Settings',
      localesDescription: AmazonLanguage,
      invocationDescription: AmazonInvocationName,
    },
    [Constants.PlatformType.GOOGLE]: {
      icon: 'googleAssistant',
      company: 'Google',
      localesText: 'Language',
      platformAppType: 'Action',
      settingsTitle: 'Action Settings',
      localesDescription: GoogleLanguage,
      invocationDescription: GoogleInvocationName,
    },
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: {
      icon: 'dialogflow',
      company: 'Google',
      localesText: 'Language',
      platformAppType: 'Action',
      settingsTitle: 'Agent Settings',
      localesDescription: DialogflowLanguage,
      invocationDescription: DialogflowInvocationName,
    },
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: {
      icon: 'dialogflow',
      company: 'Google',
      localesText: 'Language',
      platformAppType: 'Action',
      settingsTitle: 'Agent Settings',
      localesDescription: DialogflowLanguage,
      invocationDescription: DialogflowInvocationName,
    },
  },
  {
    icon: 'inFlow',
    company: '',
    iconColor: '#279745',
    localesText: 'Language',
    platformAppType: 'Assistant',
    settingsTitle: 'Assistant Settings',
    localesDescription: GeneralLanguage,
  }
);

export const getChannelMeta = createPlatformSelector<ChannelMetaType>({
  [Constants.PlatformType.ALEXA]: {
    name: 'Amazon Alexa',
    icon: 'amazonAlexa',
    platform: Constants.PlatformType.ALEXA,
    features: [PlatformFeature.DESIGN, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    iconSize: 26,
    iconColor: '#5fcaf4',
    description: 'Design, test and publish Alexa Skills',
  },
  [Constants.PlatformType.GOOGLE]: {
    name: 'Google Assistant',
    icon: 'googleAssistant',
    platform: Constants.PlatformType.GOOGLE,
    features: [PlatformFeature.DESIGN, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    iconSize: 24,
    description: 'Design, test and publish Google Actions',
  },
  [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: {
    name: 'Dialogflow Chat',
    icon: 'dialogflow',
    platform: Constants.PlatformType.DIALOGFLOW_ES_CHAT,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    iconSize: 24,
    description: 'Design, test and export or publish conversational agents',
    featureFlag: FeatureFlag.DIALOGFLOW,
    comingSoon: true,
    isNew: true,
  },
  [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: {
    name: 'Dialogflow IVR',
    icon: 'dialogflow',
    platform: Constants.PlatformType.DIALOGFLOW_ES_VOICE,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    iconSize: 24,
    description: 'Design, test and export or publish conversational agents',
    featureFlag: FeatureFlag.DIALOGFLOW,
    comingSoon: true,
    isNew: true,
  },
  [Constants.PlatformType.GENERAL]: {
    name: 'Voice Assistant',
    icon: 'microphone',
    platform: Constants.PlatformType.GENERAL,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.API],
    iconType: IconType.ICON,
    iconSize: 20,
    iconColor: '#85848c',
    description: 'Design, test and export a custom voice assistant for any modality (IVR, In-App, In-Car, IOT etc.)',
  },
  [Constants.PlatformType.CHATBOT]: {
    name: 'Chat Assistant',
    icon: 'speak',
    platform: Constants.PlatformType.CHATBOT,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.API],
    iconType: IconType.ICON,
    iconSize: 20,
    iconColor: '#85848c',
    description: 'Design, test and export a custom chat assistant for any channel (Web, Mobile, SMS etc.)',
  },
  [Constants.PlatformType.IVR]: {
    name: 'IVR',
    icon: 'call',
    platform: Constants.PlatformType.IVR,
    features: [PlatformFeature.DESIGN_AND_PROTO],
    iconType: IconType.ICON,
    iconSize: 20,
    iconColor: '#5c6bc0',
    description: 'Design, prototype and export a conversational IVR.',
  },
  [Constants.PlatformType.MOBILE_APP]: {
    name: 'Mobile App',
    icon: 'mobile',
    platform: Constants.PlatformType.MOBILE_APP,
    features: [PlatformFeature.DESIGN_AND_PROTO],
    iconType: IconType.ICON,
    iconSize: 20,
    iconColor: '#3a5999',
    description: 'Design, prototype and export a mobile voice assistant.',
  },
});

export const PLATFORM_FEATURE_META: Record<PlatformFeature, PlatformFeatureMetaType> = {
  [PlatformFeature.API]: {
    name: 'API',
    color: '#697986',
    description: "Run your voice assistant on any custom interface with Voiceflow's Dialog Manager API",
  },
  [PlatformFeature.EXPORT]: {
    name: 'Export',
    color: '#c83e5a',
    description: (platform) =>
      getPlatformValue(
        platform,
        {
          [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: 'Dialogflow specific NLU model export',
          // eslint-disable-next-line sonarjs/no-identical-functions
          [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: 'Dialogflow specific NLU model export',
        },
        'NLU specific exports for Rasa, Dialogflow, Luis and more...'
      ),
  },
  [PlatformFeature.DESIGN]: {
    name: 'Design',
    color: '#5589eb',
    description: (platform) =>
      getPlatformValue(
        platform,
        { [Constants.PlatformType.CHATBOT]: 'Collaboratively create high fidelity chat conversation designs without coding' },
        'Collaboratively create high fidelity voice conversation designs without coding'
      ),
  },
  [PlatformFeature.PUBLISH]: {
    name: 'Publish',
    color: '#558b2f',
    description: (platform) =>
      getPlatformValue(
        platform,
        {
          [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: 'Publish agents directly through Dialogflow',
          // eslint-disable-next-line sonarjs/no-identical-functions
          [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: 'Publish agents directly through Dialogflow',
          [Constants.PlatformType.ALEXA]: 'Publish live apps to the Amazon Skill store',
          [Constants.PlatformType.GOOGLE]: 'Publish live apps to the Google Action store',
        },
        ''
      ),
  },

  [PlatformFeature.DESIGN_AND_PROTO]: {
    name: 'Design & Prototype',
    color: '#5589eb',
    description: (platform) =>
      getPlatformValue(
        platform,
        {
          [Constants.PlatformType.IVR]: 'Design, prototype and share IVR system call flows',
          [Constants.PlatformType.MOBILE_APP]: 'Design and test In-App Assistant prototypes for Mobile Apps',
        },
        'Design, prototype and share conversations for any channel or custom assistant'
      ),
  },
};

export const PROJECT_SECTIONS: ProjectSection[] = [
  {
    name: 'Conversation Design',
    platforms: [Constants.PlatformType.GENERAL, Constants.PlatformType.CHATBOT],
  },
  {
    name: 'One-Click Publish',
    platforms: [
      Constants.PlatformType.ALEXA,
      Constants.PlatformType.GOOGLE,
      Constants.PlatformType.DIALOGFLOW_ES_CHAT,
      Constants.PlatformType.DIALOGFLOW_ES_VOICE,
    ],
  },
];
