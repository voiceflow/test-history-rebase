import { AlexaConstants } from '@voiceflow/alexa-types';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { Utils } from '@voiceflow/realtime-sdk';
import { createUIOnlyMenuItemOption, MenuItemGrouped } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { getLabelTooltip } from '@/components/UpgradeOption/components/getOptionTooltips';
import { GENERAL_LOCALE_NAME_MAP, GENERAL_LOCALES_OPTIONS, getDefaultPlatformLanguageLabel } from '@/constants/platforms';
import { FORMATTED_DIALOGFLOW_LOCALES_LABELS, getPreferredDialogFlowLocales } from '@/pages/Publish/Dialogflow/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS, getPreferredGoogleLocales } from '@/pages/Publish/Google/utils';
import LOCALE_MAP from '@/services/LocaleMap';

import {
  AnyLanguage,
  AnyLocale,
  FileExtension,
  LanguageSelectProps,
  PlatformAndProjectMeta,
  PlatformTypeUpcoming,
  SupportedPlatformProjectType,
} from './types';

export const DEFAULT_PROJECT_NAME = 'Untitled';

export const FILE_EXTENSION_LABEL_MAP: Record<FileExtension, string> = {
  [FileExtension.CSV]: 'CSV',
  [FileExtension.ZIP]: 'ZIP',
  [FileExtension.XML]: 'XML',
  [FileExtension.JSON]: 'JSON',
};

export const DEFAULT_LANGUAGE_SELECT_PROPS: LanguageSelectProps = {
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

export const PLATFORM_PROJECT_META_MAP: Record<SupportedPlatformProjectType | PlatformTypeUpcoming, PlatformAndProjectMeta> = {
  [VoiceflowConstants.ProjectType.CHAT]: {
    type: VoiceflowConstants.ProjectType.CHAT,
    name: 'Chat Assistant',
    tooltip: getLabelTooltip('Chat Assistant', 'Chat assistants can be connected to any channel or custom interface via API.'),
    localesText: 'Language',
  },

  [VoiceflowConstants.ProjectType.VOICE]: {
    type: VoiceflowConstants.ProjectType.VOICE,
    name: 'Voice Assistant',
    tooltip: getLabelTooltip('Voice Assistant', 'Voice assistants can be connected to any channel or custom interface via API.'),
    localesText: 'Language',
  },

  [VoiceflowConstants.PlatformType.ALEXA]: {
    type: VoiceflowConstants.PlatformType.ALEXA,
    icon: 'amazonAlexa',
    name: 'Amazon Alexa',
    tooltip: getLabelTooltip('Amazon Alexa', 'Design, prototype and launch Alexa Skills with our one-click integration.'),
    iconColor: '#5fcaf4',
    localesText: 'Locales',
    invocationDescription: 'The phrase users will use to interact with your Alexa Skill.',
  },

  [VoiceflowConstants.PlatformType.GOOGLE]: {
    type: VoiceflowConstants.PlatformType.GOOGLE,
    icon: 'googleAssistant',
    name: 'Google Assistant',
    tooltip: getLabelTooltip('Google Assistant', 'Design, prototype and launch Google Actions with our one-click integration.'),
    localesText: 'Language',
    languageSelectProps: {
      ...DEFAULT_LANGUAGE_SELECT_PROPS,
      options: getPreferredGoogleLocales(),
      getOptionValue: (option) => option?.value || '',
      getOptionLabel: (value) => (value && FORMATTED_GOOGLE_LOCALES_LABELS[value]) || '',
    },
    invocationDescription: 'The phrase users will use to interact with your Google Action.',
  },

  [VoiceflowConstants.PlatformType.VOICEFLOW]: {
    type: VoiceflowConstants.PlatformType.VOICEFLOW,
    icon: 'voiceflowV',
    name: 'Voiceflow (default)',
    tooltip: getLabelTooltip(
      'Voiceflow NLU',
      "If you don't already use one of these NLU providers, we recommend this option for the simplest experience."
    ),
    iconColor: '#132144',
    importMeta: { name: 'Voiceflow', fileExtensions: [FileExtension.CSV] },
    localesText: 'Language',
  },

  [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: {
    type: VoiceflowConstants.PlatformType.DIALOGFLOW_ES,
    icon: 'dialogflow',
    name: 'Dialogflow ES',
    importMeta: { name: 'Dialogflow ES', fileExtensions: [FileExtension.ZIP] },
    localesText: 'Language',
    languageSelectProps: {
      ...DEFAULT_LANGUAGE_SELECT_PROPS,
      options: getPreferredDialogFlowLocales(),
      getOptionValue: (option) => option?.value || '',
      getOptionLabel: (value) => (value && FORMATTED_DIALOGFLOW_LOCALES_LABELS[value]) || '',
    },
  },

  [VoiceflowConstants.PlatformType.DIALOGFLOW_CX]: {
    type: VoiceflowConstants.PlatformType.DIALOGFLOW_CX,
    icon: 'dialogflowCX',
    name: 'Dialogflow CX',
    localesText: 'Language',
  },

  [VoiceflowConstants.PlatformType.LUIS]: {
    type: VoiceflowConstants.PlatformType.LUIS,
    icon: 'luis',
    name: 'Microsoft Luis',
    importMeta: { name: 'Luis', fileExtensions: [FileExtension.JSON] },
    localesText: 'Language',
  },

  [VoiceflowConstants.PlatformType.RASA]: {
    name: 'Rasa',
    type: VoiceflowConstants.PlatformType.RASA,
    icon: 'rasa',
    importMeta: { name: 'Rasa', fileExtensions: [FileExtension.ZIP] },
    localesText: 'Language',
  },

  [VoiceflowConstants.PlatformType.EINSTEIN]: {
    type: VoiceflowConstants.PlatformType.EINSTEIN,
    icon: 'salesforce',
    name: 'Salesforce Einstein',
    importMeta: { name: 'Einstein', fileExtensions: [FileExtension.CSV] },
    localesText: 'Language',
  },

  [VoiceflowConstants.PlatformType.WATSON]: {
    type: VoiceflowConstants.PlatformType.WATSON,
    icon: 'watson',
    name: 'IBM Watson',
    importMeta: { name: 'Watson', fileExtensions: [FileExtension.JSON] },
    localesText: 'Language',
  },

  [VoiceflowConstants.PlatformType.LEX]: {
    type: VoiceflowConstants.PlatformType.LEX,
    icon: 'lex',
    name: 'Amazon Lex',
    importMeta: { name: 'Lex', fileExtensions: [FileExtension.ZIP] },
    localesText: 'Language',
  },

  [VoiceflowConstants.PlatformType.NUANCE_MIX]: {
    type: VoiceflowConstants.PlatformType.NUANCE_MIX,
    icon: 'nuanceMix',
    name: 'Nuance Mix',
    importMeta: { name: 'Nuance Mix', fileExtensions: [FileExtension.XML] },
    localesText: 'Language',
  },

  /* UPCOMING */
  [PlatformTypeUpcoming.WHATSAPP]: {
    type: PlatformTypeUpcoming.WHATSAPP,
    name: 'Whatsapp',
    disabled: true,
  },

  [PlatformTypeUpcoming.FB_MESSENGER]: {
    type: PlatformTypeUpcoming.FB_MESSENGER,
    name: 'Facebook Messenger',
    disabled: true,
  },

  [PlatformTypeUpcoming.TWILIO_IVR]: {
    type: PlatformTypeUpcoming.TWILIO_IVR,
    name: 'Twilio IVR',
    disabled: true,
  },

  [PlatformTypeUpcoming.TWILIO_SMS]: {
    type: PlatformTypeUpcoming.TWILIO_SMS,
    name: 'Twilio SMS',
    disabled: true,
  },

  [PlatformTypeUpcoming.DIALOGFLOW_CX]: {
    type: PlatformTypeUpcoming.DIALOGFLOW_CX,
    name: 'Dialogflow CX',
    disabled: true,
  },
};

export const CHANNEL_OPTIONS: MenuItemGrouped<PlatformAndProjectMeta>[] = [
  {
    id: 'custom',
    label: 'Custom',
    options: [PLATFORM_PROJECT_META_MAP[VoiceflowConstants.ProjectType.CHAT], PLATFORM_PROJECT_META_MAP[VoiceflowConstants.ProjectType.VOICE]],
  },
  {
    id: 'one-click-publish',
    label: 'One-click publish',
    options: [PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.ALEXA], PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.GOOGLE]],
  },
  {
    id: 'coming-soon',
    label: 'Coming Soon',
    options: [
      PLATFORM_PROJECT_META_MAP[PlatformTypeUpcoming.WHATSAPP],
      PLATFORM_PROJECT_META_MAP[PlatformTypeUpcoming.FB_MESSENGER],
      PLATFORM_PROJECT_META_MAP[PlatformTypeUpcoming.TWILIO_IVR],
      PLATFORM_PROJECT_META_MAP[PlatformTypeUpcoming.TWILIO_SMS],
    ],
  },
];

/** @deprecated remove after DIALOGFLOW_CX FF gone */
export const NLU_OPTIONS_NO_CX: MenuItemGrouped<PlatformAndProjectMeta>[] = [
  {
    id: 'default',
    label: '',
    options: [
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.VOICEFLOW],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.DIALOGFLOW_ES],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.WATSON],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.LUIS],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.RASA],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.EINSTEIN],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.LEX],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.NUANCE_MIX],
    ],
  },
  {
    id: 'coming-soon',
    label: 'Coming Soon',
    options: [PLATFORM_PROJECT_META_MAP[PlatformTypeUpcoming.DIALOGFLOW_CX]],
  },
];

export const NLU_OPTIONS: MenuItemGrouped<PlatformAndProjectMeta>[] = [
  {
    id: 'default',
    label: '',
    options: [
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.VOICEFLOW],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.DIALOGFLOW_ES],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.DIALOGFLOW_CX],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.WATSON],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.LUIS],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.RASA],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.EINSTEIN],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.LEX],
      PLATFORM_PROJECT_META_MAP[VoiceflowConstants.PlatformType.NUANCE_MIX],
    ],
  },
];
