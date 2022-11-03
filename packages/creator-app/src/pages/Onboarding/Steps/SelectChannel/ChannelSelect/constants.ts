import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

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
  platform: VoiceflowConstants.PlatformType;
  projectType: VoiceflowConstants.ProjectType;
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
  description: string | ((platform: VoiceflowConstants.PlatformType) => string);
}

export interface ProjectSection {
  name: string;
  platforms: {
    platform: VoiceflowConstants.PlatformType;
    projectType: VoiceflowConstants.ProjectType;
  }[];
}

export const getChannelMeta = Realtime.Utils.platform.createPlatformAndProjectTypeSelector<ChannelMetaType>({
  [VoiceflowConstants.PlatformType.ALEXA]: {
    name: 'Amazon Alexa',
    icon: 'amazonAlexa',
    platform: VoiceflowConstants.PlatformType.ALEXA,
    projectType: VoiceflowConstants.ProjectType.VOICE,
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
    projectType: VoiceflowConstants.ProjectType.VOICE,
    features: [PlatformFeature.DESIGN, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    iconSize: 24,
    description: 'Design, test and publish Google Actions',
  },
  [`${VoiceflowConstants.PlatformType.DIALOGFLOW_ES}:${VoiceflowConstants.ProjectType.CHAT}`]: {
    name: 'Dialogflow Chat',
    icon: 'dialogflow',
    platform: VoiceflowConstants.PlatformType.DIALOGFLOW_ES,
    projectType: VoiceflowConstants.ProjectType.CHAT,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    iconSize: 24,
    description: 'Design, test and export or publish conversational agents',
  },
  [`${VoiceflowConstants.PlatformType.DIALOGFLOW_ES}:${VoiceflowConstants.ProjectType.VOICE}`]: {
    name: 'Dialogflow IVR',
    icon: 'dialogflow',
    platform: VoiceflowConstants.PlatformType.DIALOGFLOW_ES,
    projectType: VoiceflowConstants.ProjectType.VOICE,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.PUBLISH],
    iconType: IconType.ICON,
    iconSize: 24,
    description: 'Design, test and export or publish conversational agents',
  },
  [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.CHAT}`]: {
    name: 'Chat Assistant',
    icon: 'speak',
    platform: VoiceflowConstants.PlatformType.VOICEFLOW,
    projectType: VoiceflowConstants.ProjectType.CHAT,
    features: [PlatformFeature.DESIGN, PlatformFeature.EXPORT, PlatformFeature.API],
    iconType: IconType.ICON,
    iconSize: 20,
    iconColor: '#85848c',
    description: 'Design, test and export a custom chat assistant for any channel (Web, Mobile, SMS etc.)',
  },
  [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.VOICE}`]: {
    name: 'Voice Assistant',
    icon: 'microphone',
    platform: VoiceflowConstants.PlatformType.VOICEFLOW,
    projectType: VoiceflowConstants.ProjectType.VOICE,
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
          [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 'Dialogflow specific NLU model export',
        },
        'NLU specific exports for Rasa, Dialogflow, Luis and more...'
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
    platforms: [
      { platform: VoiceflowConstants.PlatformType.VOICEFLOW, projectType: VoiceflowConstants.ProjectType.CHAT },
      { platform: VoiceflowConstants.PlatformType.VOICEFLOW, projectType: VoiceflowConstants.ProjectType.VOICE },
    ],
  },
  {
    name: 'One-Click Publish',
    platforms: [
      { platform: VoiceflowConstants.PlatformType.ALEXA, projectType: VoiceflowConstants.ProjectType.VOICE },
      { platform: VoiceflowConstants.PlatformType.GOOGLE, projectType: VoiceflowConstants.ProjectType.VOICE },
      { platform: VoiceflowConstants.PlatformType.DIALOGFLOW_ES, projectType: VoiceflowConstants.ProjectType.CHAT },
      { platform: VoiceflowConstants.PlatformType.DIALOGFLOW_ES, projectType: VoiceflowConstants.ProjectType.VOICE },
    ],
  },
];
