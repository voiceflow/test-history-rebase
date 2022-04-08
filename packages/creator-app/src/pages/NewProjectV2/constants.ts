import { AlexaConstants } from '@voiceflow/alexa-types';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { Utils } from '@voiceflow/realtime-sdk';
import { createUIOnlyMenuItemOption } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { GENERAL_LOCALE_NAME_MAP, GENERAL_LOCALES_OPTIONS, getDefaultPlatformLanguageLabel } from '@/constants/platforms';
import { FORMATTED_DIALOGFLOW_LOCALES_LABELS, getPreferredDialogFlowLocales } from '@/pages/Publish/Dialogflow/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS, getPreferredGoogleLocales } from '@/pages/Publish/Google/utils';
import LOCALE_MAP from '@/services/LocaleMap';

import getSelectTooltip from './components/SelectTooltip';
import { AnyLanguage, AnyLocale, LanguageSelectProps, PlatformAndProjectTypeMeta, PlatformTypeUpcoming, Section } from './types';

export const DEFAULT_PROJECT_NAME = 'Untitled';

export const ChannelSectionErrorMessage = 'Channel selection is required';
export const NLUSectionErrorMessage =
  'NLU selection is required. If you don’t already use one of these providers we recommend selecting the Voiceflow option.';
export const InvocationSectionErrorMessage = 'Invocation name is required';

export const defaultLanguageSelectProps: LanguageSelectProps = {
  options: [GENERAL_LOCALES_OPTIONS[0], createUIOnlyMenuItemOption('divider', { divider: true }), ...GENERAL_LOCALES_OPTIONS.slice(1)],
  placeholder: 'Select language',
  getOptionKey: (option) => option.value,
  getOptionValue: (option) => option?.value || VoiceflowConstants.Locale.EN_US,
  getOptionLabel: (value) => GENERAL_LOCALE_NAME_MAP[value as VoiceflowConstants.Locale] ?? '',
  renderOptionLabel: (option) => option.name,
};

export const getLanguage = (language: AnyLanguage, alexaLocales: AnyLocale[], platformType: VoiceflowConstants.PlatformType) => {
  const defaultLabel = getDefaultPlatformLanguageLabel(platformType);

  return Utils.platform.createPlatformSelector(
    {
      [VoiceflowConstants.PlatformType.ALEXA]: LOCALE_MAP.find((locale) => locale.value === alexaLocales[0])?.name ?? defaultLabel,
      [VoiceflowConstants.PlatformType.GOOGLE]: FORMATTED_GOOGLE_LOCALES_LABELS[language] ?? defaultLabel,
      [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: FORMATTED_DIALOGFLOW_LOCALES_LABELS[language] ?? defaultLabel,
    },
    GENERAL_LOCALE_NAME_MAP[language as VoiceflowConstants.Locale] ?? defaultLabel
  )(platformType);
};

export const getDefaultLanguage = Utils.platform.createPlatformSelector<AnyLanguage | AnyLocale[]>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: [AlexaConstants.Locale.EN_US],
    [VoiceflowConstants.PlatformType.GOOGLE]: GoogleConstants.Language.EN,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: DFESConstants.Language.EN,
  },
  VoiceflowConstants.Locale.EN_US
);

export const getPlatformOrProjectTypeMeta: Partial<
  Record<VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType | PlatformTypeUpcoming, PlatformAndProjectTypeMeta>
> = {
  [VoiceflowConstants.ProjectType.CHAT]: {
    name: 'Chat Assistant',
    tooltip: getSelectTooltip('Chat Assistant', 'Chat assistants can be connected to any channel or custom interface via API.'),
    localesText: 'Language',
    disabled: false,
    type: VoiceflowConstants.ProjectType.CHAT,
  },
  [VoiceflowConstants.ProjectType.VOICE]: {
    name: 'Voice Assistant',
    tooltip: getSelectTooltip('Voice Assistant', 'Voice assistants can be connected to any channel or custom interface via API.'),
    localesText: 'Language',
    disabled: false,
    type: VoiceflowConstants.ProjectType.VOICE,
  },
  [VoiceflowConstants.PlatformType.ALEXA]: {
    name: 'Amazon Alexa',
    tooltip: getSelectTooltip('Amazon Alexa', 'Design, prototype and launch Alexa Skills with our one-click integration.'),
    invocationDescription: 'The phrase users will use to interact with your Alexa Skill.',
    localesText: 'Locales',
    disabled: false,
    type: VoiceflowConstants.PlatformType.ALEXA,
    icon: 'amazonAlexa',
  },
  [VoiceflowConstants.PlatformType.GOOGLE]: {
    name: 'Google Assistant',
    tooltip: getSelectTooltip('Google Assistant', 'Design, prototype and launch Google Actions with our one-click integration.'),
    invocationDescription: 'The phrase users will use to interact with your Google Action.',
    localesText: 'Language',
    disabled: false,
    type: VoiceflowConstants.PlatformType.GOOGLE,
    icon: 'googleAssistant',

    languageSelectProps: {
      options: getPreferredGoogleLocales(),
      placeholder: 'Select language',
      getOptionKey: (option) => option.value,
      getOptionValue: (option) => option?.value || '',
      getOptionLabel: (value) => (value && FORMATTED_GOOGLE_LOCALES_LABELS[value]) || '',
      renderOptionLabel: (option) => option.name,
    },
  },
  [VoiceflowConstants.PlatformType.VOICEFLOW]: {
    name: 'Voiceflow (default)',
    tooltip: getSelectTooltip(
      'Voiceflow NLU',
      "If you don't already use one of these NLU providers, we recommend this option for the simplest experience."
    ),
    localesText: 'Language',
    disabled: false,
    type: VoiceflowConstants.PlatformType.VOICEFLOW,
  },
  [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: {
    name: 'Dialogflow ES',
    tooltip: getSelectTooltip('Dialogflow ES', 'Import and export/upload NLU models for Dialogflow agents.'),
    localesText: 'Language',
    disabled: false,
    type: VoiceflowConstants.PlatformType.DIALOGFLOW_ES,
    icon: 'dialogflow',
    languageSelectProps: {
      options: getPreferredDialogFlowLocales(),
      placeholder: 'Select language',
      getOptionKey: (option) => option.value,
      getOptionValue: (option) => option?.value || '',
      getOptionLabel: (value) => (value && FORMATTED_DIALOGFLOW_LOCALES_LABELS[value]) || '',
      renderOptionLabel: (option) => option.name,
    },
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

export const getPlatformTag: Partial<Record<VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType, string>> = {
  [VoiceflowConstants.ProjectType.CHAT]: VoiceflowConstants.ProjectType.CHAT,
  [VoiceflowConstants.ProjectType.VOICE]: VoiceflowConstants.ProjectType.VOICE,
  [VoiceflowConstants.PlatformType.GOOGLE]: 'default',
};

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
