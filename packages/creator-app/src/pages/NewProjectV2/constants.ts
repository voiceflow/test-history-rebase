import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export enum PlatformTypeUpcoming {
  WHATSAPP = 'whatsapp',
  FB_MESSENGER = 'fb_messenger',
  TWILIO_IVR = 'twilio_ivr',
  TWILIO_SMS = 'twilio_SMS',
  IBM_WATSON = 'ibm_watson',
  MICROSOFT_LUIS = 'microsoft_luis',
  RASA = 'rasa',
  SALESFORCE_EINSTEIN = 'salesforce_einstein',
  DIALOGFLOW_CX = 'dialogflow_cx',
  NUANCE_MIX = 'nuance_mix',
}

export interface PlatformAndProjectTypeMeta {
  name: string;
  description?: string;
  invocationDescription?: string;
  localesText?: string;
  disabled: boolean;
  type?: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType | PlatformTypeUpcoming;
}

export const getPlatformOrProjectTypeMeta: Partial<
  Record<VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType | PlatformTypeUpcoming, PlatformAndProjectTypeMeta>
> = {
  [VoiceflowConstants.ProjectType.CHAT]: {
    name: 'Chat Assistant',
    description: 'Chat assistants can be connected to any channel or custom interface via API.',
    localesText: 'Language',
    disabled: false,
    type: VoiceflowConstants.ProjectType.CHAT,
  },
  [VoiceflowConstants.ProjectType.VOICE]: {
    name: 'Voice Assistant',
    description: 'Voice assistants can be connected to any channel or custom interface via API.',
    localesText: 'Language',
    disabled: false,
    type: VoiceflowConstants.ProjectType.VOICE,
  },
  [VoiceflowConstants.PlatformType.ALEXA]: {
    name: 'Amazon Alexa',
    description: 'Design, prototype and launch Alexa Skills with our one-click integration',
    invocationDescription: 'The phrase users will use to interact with your Alexa Skill.',
    localesText: 'Locales',
    disabled: false,
    type: VoiceflowConstants.PlatformType.ALEXA,
  },
  [VoiceflowConstants.PlatformType.GOOGLE]: {
    name: 'Google Assistant',
    description: 'Design, prototype and launch Google Actions with our one-click integration',
    invocationDescription: 'The phrase users will use to interact with your Google Action.',
    localesText: 'Language',
    disabled: false,
    type: VoiceflowConstants.PlatformType.GOOGLE,
  },
  [VoiceflowConstants.PlatformType.VOICEFLOW]: {
    name: 'Voiceflow (default)',
    description: "If you don't already use one of these NLU providers, we recommend this option for the simplest experience.",
    localesText: 'Language',
    disabled: false,
    type: VoiceflowConstants.PlatformType.VOICEFLOW,
  },
  [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: {
    name: 'Dialogflow ES',
    description: 'Import and export/upload NLU models for Dialogflow agents.',
    localesText: 'Language',
    disabled: false,
    type: VoiceflowConstants.PlatformType.DIALOGFLOW_ES,
  },
  /* UPCOMING */
  [PlatformTypeUpcoming.WHATSAPP]: {
    name: 'Whatsapp',
    type: PlatformTypeUpcoming.WHATSAPP,
    disabled: true,
  },
  [PlatformTypeUpcoming.FB_MESSENGER]: {
    name: 'Facebook Messenger',
    type: PlatformTypeUpcoming.FB_MESSENGER,
    disabled: true,
  },
  [PlatformTypeUpcoming.TWILIO_IVR]: {
    name: 'Twilio IVR',
    type: PlatformTypeUpcoming.TWILIO_IVR,
    disabled: true,
  },
  [PlatformTypeUpcoming.TWILIO_SMS]: {
    name: 'Twilio SMS',
    type: PlatformTypeUpcoming.TWILIO_SMS,
    disabled: true,
  },
  [PlatformTypeUpcoming.IBM_WATSON]: {
    name: 'IBM Watson',
    disabled: true,
    type: PlatformTypeUpcoming.IBM_WATSON,
  },
  [PlatformTypeUpcoming.MICROSOFT_LUIS]: {
    name: 'Microsoft Luis',
    disabled: true,
    type: PlatformTypeUpcoming.MICROSOFT_LUIS,
  },
  [PlatformTypeUpcoming.RASA]: {
    name: 'Rasa',
    disabled: true,
    type: PlatformTypeUpcoming.RASA,
  },
  [PlatformTypeUpcoming.SALESFORCE_EINSTEIN]: {
    name: 'Salesforce Einstein',
    type: PlatformTypeUpcoming.SALESFORCE_EINSTEIN,
    disabled: true,
  },
  [PlatformTypeUpcoming.DIALOGFLOW_CX]: {
    name: 'Dialogflow CX',
    type: PlatformTypeUpcoming.DIALOGFLOW_CX,
    disabled: true,
  },
  [PlatformTypeUpcoming.NUANCE_MIX]: {
    name: 'Nuance Mix',
    type: PlatformTypeUpcoming.NUANCE_MIX,
    disabled: true,
  },
};

export interface Section {
  label: string;
  options: (PlatformAndProjectTypeMeta | undefined)[];
}

export const CHANNEL_SECTIONS: Section[] = [
  {
    label: 'Channel',
    options: [getPlatformOrProjectTypeMeta[VoiceflowConstants.ProjectType.CHAT], getPlatformOrProjectTypeMeta[VoiceflowConstants.ProjectType.VOICE]],
  },
  {
    label: 'One-click',
    options: [
      getPlatformOrProjectTypeMeta[VoiceflowConstants.PlatformType.ALEXA],
      getPlatformOrProjectTypeMeta[VoiceflowConstants.PlatformType.GOOGLE],
    ],
  },
  {
    label: 'Coming Soon',
    options: [
      getPlatformOrProjectTypeMeta[PlatformTypeUpcoming.WHATSAPP],
      getPlatformOrProjectTypeMeta[PlatformTypeUpcoming.FB_MESSENGER],
      getPlatformOrProjectTypeMeta[PlatformTypeUpcoming.TWILIO_IVR],
      getPlatformOrProjectTypeMeta[PlatformTypeUpcoming.TWILIO_SMS],
    ],
  },
];

export const NLU_SECTIONS: Section[] = [
  {
    label: '',
    options: [
      getPlatformOrProjectTypeMeta[VoiceflowConstants.PlatformType.VOICEFLOW],
      getPlatformOrProjectTypeMeta[VoiceflowConstants.PlatformType.DIALOGFLOW_ES],
    ],
  },
  {
    label: 'Coming Soon',
    options: [
      getPlatformOrProjectTypeMeta[PlatformTypeUpcoming.IBM_WATSON],
      getPlatformOrProjectTypeMeta[PlatformTypeUpcoming.MICROSOFT_LUIS],
      getPlatformOrProjectTypeMeta[PlatformTypeUpcoming.RASA],
      getPlatformOrProjectTypeMeta[PlatformTypeUpcoming.SALESFORCE_EINSTEIN],
      getPlatformOrProjectTypeMeta[PlatformTypeUpcoming.DIALOGFLOW_CX],
      getPlatformOrProjectTypeMeta[PlatformTypeUpcoming.NUANCE_MIX],
    ],
  },
];
