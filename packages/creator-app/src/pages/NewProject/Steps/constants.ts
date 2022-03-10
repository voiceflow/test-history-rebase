import { Utils } from '@voiceflow/realtime-sdk';
import { Icon } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { AmazonInvocationName, DialogflowInvocationName, GoogleInvocationName } from '@/pages/NewProject/DescriptionElements/InvocationName';
import { AmazonLanguage, DialogflowLanguage, GeneralLanguage, GoogleLanguage } from '@/pages/NewProject/DescriptionElements/Languages';
import { getPlatformValue } from '@/utils/platform';

export enum PlatformFeature {
  API = 'api',
  EXPORT = 'export',
  DESIGN = 'design',
  PUBLISH = 'publish',
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
  platform: VoiceflowConstants.PlatformType;
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
  description: string | ((platform: VoiceflowConstants.PlatformType) => string);
}

export interface ProjectSection {
  name: string;
  platforms: VoiceflowConstants.PlatformType[];
}

export const getPlatformMeta = Utils.platform.createPlatformSelectorV2<PlatformMetaType>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: {
      icon: 'amazonAlexa',
      company: 'Amazon',
      iconColor: '#5fcaf4',
      localesText: 'Locales',
      platformAppType: 'Skill',
      settingsTitle: 'Skill Settings',
      localesDescription: AmazonLanguage,
      invocationDescription: AmazonInvocationName,
    },
    [VoiceflowConstants.PlatformType.GOOGLE]: {
      icon: 'googleAssistant',
      company: 'Google',
      localesText: 'Language',
      platformAppType: 'Action',
      settingsTitle: 'Action Settings',
      localesDescription: GoogleLanguage,
      invocationDescription: GoogleInvocationName,
    },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: {
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

export const getChannelMeta = Utils.platform.createPlatformSelector<ChannelMetaType>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: {
      name: 'Amazon Alexa',
      icon: 'amazonAlexa',
      platform: VoiceflowConstants.PlatformType.ALEXA,
      features: [PlatformFeature.DESIGN, PlatformFeature.PUBLISH],
      iconType: IconType.ICON,
      iconSize: 26,
      iconColor: '#5fcaf4',
      description: 'Design, test and publish Alexa Skills',
    },
    [VoiceflowConstants.PlatformType.GOOGLE]: {
      name: 'Google Assistant',
      icon: 'googleAssistant',
      platform: VoiceflowConstants.PlatformType.GOOGLE,
      features: [PlatformFeature.DESIGN, PlatformFeature.PUBLISH],
      iconType: IconType.ICON,
      iconSize: 24,
      description: 'Design, test and publish Google Actions',
    },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: {
      name: 'Dialogflow Chat',
      icon: 'dialogflow',
      platform: VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT,
      features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.PUBLISH],
      iconType: IconType.ICON,
      iconSize: 24,
      description: 'Design, test and export or publish conversational agents',
    },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: {
      name: 'Dialogflow IVR',
      icon: 'dialogflow',
      platform: VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE,
      features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.PUBLISH],
      iconType: IconType.ICON,
      iconSize: 24,
      description: 'Design, test and export or publish conversational agents',
    },
    [VoiceflowConstants.PlatformType.CHATBOT]: {
      name: 'Chat Assistant',
      icon: 'speak',
      platform: VoiceflowConstants.PlatformType.CHATBOT,
      features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.API],
      iconType: IconType.ICON,
      iconSize: 20,
      iconColor: '#85848c',
      description: 'Design, test and export a custom chat assistant for any channel (Web, Mobile, SMS etc.)',
    },
  },
  {
    name: 'Voice Assistant',
    icon: 'microphone',
    platform: VoiceflowConstants.PlatformType.GENERAL,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.API],
    iconType: IconType.ICON,
    iconSize: 20,
    iconColor: '#85848c',
    description: 'Design, test and export a custom voice assistant for any modality (IVR, In-App, In-Car, IOT etc.)',
  }
);

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
      Utils.platform.createPlatformSelectorV2(
        {
          [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 'Dialogflow specific NLU model export',
        },
        'NLU specific exports for Rasa, Dialogflow, Luis and more...'
      )(platform),
  },
  [PlatformFeature.DESIGN]: {
    name: 'Design',
    color: '#5589eb',
    description: (platform) =>
      getPlatformValue(
        platform,
        { [VoiceflowConstants.PlatformType.CHATBOT]: 'Collaboratively create high fidelity chat conversation designs without coding' },
        'Collaboratively create high fidelity voice conversation designs without coding'
      ),
  },
  [PlatformFeature.PUBLISH]: {
    name: 'Publish',
    color: '#558b2f',
    description: (platform) =>
      Utils.platform.createPlatformSelectorV2(
        {
          [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 'Publish agents directly through Dialogflow',
          [VoiceflowConstants.PlatformType.ALEXA]: 'Publish live apps to the Amazon Skill store',
          [VoiceflowConstants.PlatformType.GOOGLE]: 'Publish live apps to the Google Action store',
        },
        ''
      )(platform),
  },
};

export const PROJECT_SECTIONS: ProjectSection[] = [
  {
    name: 'Conversation Design',
    platforms: [VoiceflowConstants.PlatformType.GENERAL, VoiceflowConstants.PlatformType.CHATBOT],
  },
  {
    name: 'One-Click Publish',
    platforms: [
      VoiceflowConstants.PlatformType.ALEXA,
      VoiceflowConstants.PlatformType.GOOGLE,
      VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT,
      VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE,
    ],
  },
];
