import { Nullish } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

/* CHANNELS */

export enum ChannelType {
  CHAT = 'chat',
  VOICE = 'voice',
  GOOGLE = 'google',
  ALEXA = 'alexa',
  WHATSAPP = 'whatsapp',
  FB_MESSENGER = 'fb_messenger',
  TWILIO_IVR = 'twilio_ivr',
  TWILIO_SMS = 'twilio_SMS',
}

export interface ChannelMetaType {
  name: string;
  type: ChannelType;
  description: string;
  invocationDescription?: string;
  channelSectionType: ChannelSectionType;
  disabled: boolean;
}

export enum ChannelSectionType {
  CUSTOM = 'custom',
  ONE_CLICK = 'one_click',
  COMING_SOON = 'coming_soon',
}

export interface ChannelSection {
  name: string;
  label: string;
  type: ChannelSectionType;
  options: ChannelMetaType[];
}

export const getChannelMeta: Record<ChannelType, ChannelMetaType> = {
  [ChannelType.CHAT]: {
    name: 'Chat Assistant',
    type: ChannelType.CHAT,
    description: 'Chat assistants can be connected to any channel or custom interface via API.',
    channelSectionType: ChannelSectionType.CUSTOM,
    disabled: false,
  },
  [ChannelType.VOICE]: {
    name: 'Voice Assistant',
    type: ChannelType.VOICE,
    description: 'Voice assistants can be connected to any channel or custom interface via API.',
    channelSectionType: ChannelSectionType.CUSTOM,
    disabled: false,
  },
  [ChannelType.ALEXA]: {
    name: 'Amazon Alexa',
    type: ChannelType.ALEXA,
    description: 'Design, prototype and launch Alexa Skills with our one-click integration',
    invocationDescription: 'The phrase users will use to interact with your Alexa Skill.',
    channelSectionType: ChannelSectionType.ONE_CLICK,
    disabled: false,
  },
  [ChannelType.GOOGLE]: {
    name: 'Google Assistant',
    type: ChannelType.GOOGLE,
    description: 'Design, prototype and launch Google Actions with our one-click integration',
    invocationDescription: 'The phrase users will use to interact with your Google Action.',
    channelSectionType: ChannelSectionType.ONE_CLICK,
    disabled: false,
  },
  [ChannelType.WHATSAPP]: {
    name: 'Whatsapp',
    type: ChannelType.WHATSAPP,
    description: 'Design, prototype and launch Google Actions with our one-click integration',
    channelSectionType: ChannelSectionType.COMING_SOON,
    disabled: true,
  },
  [ChannelType.FB_MESSENGER]: {
    name: 'Facebook Messenger',
    type: ChannelType.FB_MESSENGER,
    description: 'Design, prototype and launch Google Actions with our one-click integration',
    channelSectionType: ChannelSectionType.COMING_SOON,
    disabled: true,
  },
  [ChannelType.TWILIO_IVR]: {
    name: 'Twilio IVR',
    type: ChannelType.TWILIO_IVR,
    description: 'Design, prototype and launch Google Actions with our one-click integration',
    channelSectionType: ChannelSectionType.COMING_SOON,
    disabled: true,
  },
  [ChannelType.TWILIO_SMS]: {
    name: 'Twilio SMS',
    type: ChannelType.TWILIO_SMS,
    description: 'Design, prototype and launch Google Actions with our one-click integration',
    channelSectionType: ChannelSectionType.COMING_SOON,
    disabled: true,
  },
};

export const CHANNEL_SECTIONS: ChannelSection[] = [
  {
    name: 'Channel',
    label: 'Channel',
    type: ChannelSectionType.CUSTOM,
    options: [getChannelMeta[ChannelType.CHAT], getChannelMeta[ChannelType.VOICE]],
  },
  {
    name: 'One-click',
    label: 'One-click',
    type: ChannelSectionType.ONE_CLICK,
    options: [getChannelMeta[ChannelType.GOOGLE], getChannelMeta[ChannelType.ALEXA]],
  },
  {
    name: 'Coming soon',
    label: 'Coming soon',
    type: ChannelSectionType.COMING_SOON,

    options: [
      getChannelMeta[ChannelType.WHATSAPP],
      getChannelMeta[ChannelType.FB_MESSENGER],
      getChannelMeta[ChannelType.TWILIO_IVR],
      getChannelMeta[ChannelType.TWILIO_SMS],
    ],
  },
];

export const channelTypeToPlatformType: Record<ChannelType, Nullish<VoiceflowConstants.PlatformType>> = {
  [ChannelType.ALEXA]: VoiceflowConstants.PlatformType.ALEXA,
  [ChannelType.GOOGLE]: VoiceflowConstants.PlatformType.GOOGLE,
  [ChannelType.CHAT]: null,
  [ChannelType.VOICE]: null,
  [ChannelType.WHATSAPP]: null,
  [ChannelType.FB_MESSENGER]: null,
  [ChannelType.TWILIO_IVR]: null,
  [ChannelType.TWILIO_SMS]: null,
};

/* NLUs */

export enum NLUType {
  VOICEFLOW = 'voiceflow',
  DIALOGFLOW_ES = 'dialogflow_es',
  IBM_WATSON = 'ibm_watson',
  MICROSOFT_LUIS = 'microsoft_luis',
  RASA = 'rasa',
  SALESFORCE_EINSTEIN = 'salesforce_einstein',
  DIALOGFLOW_CX = 'dialogflow_cx',
  NUANCE_MIX = 'nuance_mix',
}

export interface NLUMetaType {
  name: string;
  type: NLUType;
  description: string;
  disabled: boolean;
}

export enum NLUSectionType {
  SUPPORTED = 'supported',
  COMING_SOON = 'coming_soon',
}

export interface NLUSection {
  name: string;
  label: string;
  type: NLUSectionType;
  options: NLUMetaType[];
}

export const getNLUMeta: Record<NLUType, NLUMetaType> = {
  [NLUType.VOICEFLOW]: {
    name: 'Voiceflow (default)',
    type: NLUType.VOICEFLOW,
    description: "If you don't already use one of these NLU providers, we recommend this option for the simplest experience.",
    disabled: false,
  },
  [NLUType.DIALOGFLOW_ES]: {
    name: 'Dialogflow ES',
    type: NLUType.DIALOGFLOW_ES,
    description: 'Import and export/upload NLU models for Dialogflow agents.',
    disabled: false,
  },
  [NLUType.IBM_WATSON]: {
    name: 'IBM Watson',
    type: NLUType.IBM_WATSON,
    description: 'Import and export NLU models for IBM Watson.',
    disabled: false,
  },
  [NLUType.MICROSOFT_LUIS]: {
    name: 'Microsoft Luis',
    type: NLUType.MICROSOFT_LUIS,
    description: 'Import and export NLU models for Microsoft Luis.',
    disabled: false,
  },
  [NLUType.RASA]: {
    name: 'Rasa',
    type: NLUType.RASA,
    description: 'Import and export NLU models for Rasa.',
    disabled: false,
  },
  [NLUType.SALESFORCE_EINSTEIN]: {
    name: 'Salesforce Einstein',
    type: NLUType.SALESFORCE_EINSTEIN,
    description: 'Import and export NLU models for Einstein.',
    disabled: false,
  },
  [NLUType.DIALOGFLOW_CX]: {
    name: 'Dialogflow CX',
    type: NLUType.DIALOGFLOW_CX,
    description: '',
    disabled: true,
  },
  [NLUType.NUANCE_MIX]: {
    name: 'Nuance Mix',
    type: NLUType.NUANCE_MIX,
    description: '',
    disabled: true,
  },
};

export const NLU_SECTIONS: NLUSection[] = [
  {
    name: '',
    label: '',
    type: NLUSectionType.SUPPORTED,
    options: [
      getNLUMeta[NLUType.VOICEFLOW],
      getNLUMeta[NLUType.DIALOGFLOW_ES],
      getNLUMeta[NLUType.IBM_WATSON],
      getNLUMeta[NLUType.MICROSOFT_LUIS],
      getNLUMeta[NLUType.RASA],
      getNLUMeta[NLUType.SALESFORCE_EINSTEIN],
    ],
  },
  {
    name: 'Coming soon',
    label: 'Coming soon',
    type: NLUSectionType.COMING_SOON,
    options: [getNLUMeta[NLUType.DIALOGFLOW_CX], getNLUMeta[NLUType.NUANCE_MIX]],
  },
];
