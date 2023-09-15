import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';

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

export interface ChannelMetaType {
  name: string;
  icon: SvgIconTypes.Icon;
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  features: PlatformFeature[];
  iconType: IconType;
  iconSize: number;
  iconColor?: string;
  comingSoon?: boolean;
  isNew?: boolean;
  description: string;
  featureFlag?: Realtime.FeatureFlag;
}

export interface PlatformFeatureMetaType {
  name: string;
  color: string;
  description: string | ((platform: Platform.Constants.PlatformType) => string);
}

export interface ProjectSection {
  name: string;
  platforms: {
    platform: Platform.Constants.PlatformType;
    projectType: Platform.Constants.ProjectType;
  }[];
}

export const getChannelMeta = Realtime.Utils.platform.createPlatformAndProjectTypeSelector<ChannelMetaType>({
  [Platform.Constants.PlatformType.ALEXA]: {
    name: 'Amazon Alexa',
    icon: 'amazonAlexa',
    platform: Platform.Constants.PlatformType.ALEXA,
    projectType: Platform.Constants.ProjectType.VOICE,
    features: [PlatformFeature.DESIGN, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    iconSize: 26,
    iconColor: '#5fcaf4',
    description: 'Design, test and publish Alexa Skills',
  },
  [Platform.Constants.PlatformType.GOOGLE]: {
    name: 'Google Assistant',
    icon: 'logoGoogleAssistant',
    platform: Platform.Constants.PlatformType.GOOGLE,
    projectType: Platform.Constants.ProjectType.VOICE,
    features: [PlatformFeature.DESIGN, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    iconSize: 24,
    description: 'Design, test and publish Google Actions',
  },
  [`${Platform.Constants.PlatformType.DIALOGFLOW_ES}:${Platform.Constants.ProjectType.CHAT}`]: {
    name: 'Dialogflow Chat',
    icon: 'logoDialogflow',
    platform: Platform.Constants.PlatformType.DIALOGFLOW_ES,
    projectType: Platform.Constants.ProjectType.CHAT,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    iconSize: 24,
    description: 'Design, test and export or publish conversational agents',
  },
  [`${Platform.Constants.PlatformType.DIALOGFLOW_ES}:${Platform.Constants.ProjectType.VOICE}`]: {
    name: 'Dialogflow IVR',
    icon: 'logoDialogflow',
    platform: Platform.Constants.PlatformType.DIALOGFLOW_ES,
    projectType: Platform.Constants.ProjectType.VOICE,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    iconSize: 24,
    description: 'Design, test and export or publish conversational agents',
  },
  [`${Platform.Constants.PlatformType.VOICEFLOW}:${Platform.Constants.ProjectType.CHAT}`]: {
    name: 'Chat Assistant',
    icon: 'speak',
    platform: Platform.Constants.PlatformType.VOICEFLOW,
    projectType: Platform.Constants.ProjectType.CHAT,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.API],
    iconType: IconType.ICON,
    iconSize: 20,
    iconColor: '#85848c',
    description: 'Design, test and export a custom chat assistant for any channel (Web, Mobile, SMS etc.)',
  },
  [`${Platform.Constants.PlatformType.VOICEFLOW}:${Platform.Constants.ProjectType.VOICE}`]: {
    name: 'Voice Assistant',
    icon: 'microphone',
    platform: Platform.Constants.PlatformType.VOICEFLOW,
    projectType: Platform.Constants.ProjectType.VOICE,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.API],
    iconType: IconType.ICON,
    iconSize: 20,
    iconColor: '#85848c',
    description: 'Design, test and export a custom voice assistant for any modality (IVR, In-App, In-Car, IOT etc.)',
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
      Realtime.Utils.platform.createPlatformSelector(
        {
          [Platform.Constants.PlatformType.DIALOGFLOW_ES]: 'Dialogflow specific NLU model export',
        },
        'NLU specific exports for Rasa, Dialogflow, Lex and more...'
      )(platform),
  },
  [PlatformFeature.DESIGN]: {
    name: 'Design',
    color: '#5589eb',
    description: () => 'Collaboratively create high fidelity conversation designs without coding',
  },
  [PlatformFeature.PUBLISH]: {
    name: 'Publish',
    color: '#558b2f',
    description: (platform) =>
      Realtime.Utils.platform.createPlatformSelector(
        {
          [Platform.Constants.PlatformType.DIALOGFLOW_ES]: 'Publish agents directly through Dialogflow',
          [Platform.Constants.PlatformType.ALEXA]: 'Publish live apps to the Amazon Skill store',
          [Platform.Constants.PlatformType.GOOGLE]: 'Publish live apps to the Google Action store',
        },
        ''
      )(platform),
  },
};

export const PROJECT_SECTIONS: ProjectSection[] = [
  {
    name: 'Conversation Design',
    platforms: [
      { platform: Platform.Constants.PlatformType.VOICEFLOW, projectType: Platform.Constants.ProjectType.CHAT },
      { platform: Platform.Constants.PlatformType.VOICEFLOW, projectType: Platform.Constants.ProjectType.VOICE },
    ],
  },
  {
    name: 'One-Click Publish',
    platforms: [
      { platform: Platform.Constants.PlatformType.ALEXA, projectType: Platform.Constants.ProjectType.VOICE },
      { platform: Platform.Constants.PlatformType.GOOGLE, projectType: Platform.Constants.ProjectType.VOICE },
      { platform: Platform.Constants.PlatformType.DIALOGFLOW_ES, projectType: Platform.Constants.ProjectType.CHAT },
      { platform: Platform.Constants.PlatformType.DIALOGFLOW_ES, projectType: Platform.Constants.ProjectType.VOICE },
    ],
  },
];
