import { AlexaConstants } from '@voiceflow/alexa-types';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform';
import { Utils } from '@voiceflow/realtime-sdk';
import { createDividerMenuItemOption } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as NLU from '@/config/nlu';
import { GENERAL_LOCALE_NAME_MAP, GENERAL_LOCALES_OPTIONS, getDefaultPlatformLanguageLabel } from '@/constants/platforms';
import { FORMATTED_DIALOGFLOW_LOCALES_LABELS, getPreferredDialogFlowLocales } from '@/pages/Publish/Dialogflow/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS, getPreferredGoogleLocales } from '@/pages/Publish/Google/utils';
import LOCALE_MAP from '@/services/LocaleMap';

import { AnyLanguage, AnyLocale, LanguageSelectProps, PlatformAndProjectMeta } from '../types';

export * as Channel from './channel';
export * from './nlu';
export * as Upcoming from './upcoming';

export const DEFAULT_PROJECT_NAME = 'Untitled';

export const DEFAULT_LANGUAGE_SELECT_PROPS: LanguageSelectProps = {
  options: [GENERAL_LOCALES_OPTIONS[0], createDividerMenuItemOption(), ...GENERAL_LOCALES_OPTIONS.slice(1)],
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

// [PLATFORM] TODO: remove when fully migrated
export const PLATFORM_PROJECT_META_MAP: Record<NLU.Constants.NLUType | Platform.Constants.PlatformType, PlatformAndProjectMeta> = {
  [Platform.Constants.PlatformType.VOICEFLOW]: {
    localesText: 'Language',
  },

  [Platform.Constants.PlatformType.WEBCHAT]: {
    localesText: 'Language',
  },

  [Platform.Constants.PlatformType.ALEXA]: {
    localesText: 'Locales',
    invocationDescription: 'The phrase users will use to interact with your Alexa Skill.',
  },

  [Platform.Constants.PlatformType.GOOGLE]: {
    localesText: 'Language',
    languageSelectProps: {
      ...DEFAULT_LANGUAGE_SELECT_PROPS,
      options: getPreferredGoogleLocales(),
      getOptionValue: (option) => option?.value || '',
      getOptionLabel: (value) => (value && FORMATTED_GOOGLE_LOCALES_LABELS[value]) || '',
    },
    invocationDescription: 'The phrase users will use to interact with your Google Action.',
  },

  [NLU.Constants.NLUType.DIALOGFLOW_ES]: {
    localesText: 'Language',
    languageSelectProps: {
      ...DEFAULT_LANGUAGE_SELECT_PROPS,
      options: getPreferredDialogFlowLocales(),
      getOptionValue: (option) => option?.value || '',
      getOptionLabel: (value) => (value && FORMATTED_DIALOGFLOW_LOCALES_LABELS[value]) || '',
    },
  },

  [NLU.Constants.NLUType.DIALOGFLOW_CX]: {
    localesText: 'Language',
  },

  [NLU.Constants.NLUType.LUIS]: {
    localesText: 'Language',
  },

  [NLU.Constants.NLUType.RASA]: {
    localesText: 'Language',
  },

  [NLU.Constants.NLUType.EINSTEIN]: {
    localesText: 'Language',
  },

  [NLU.Constants.NLUType.WATSON]: {
    localesText: 'Language',
  },

  [NLU.Constants.NLUType.LEX]: {
    localesText: 'Language',
  },

  [NLU.Constants.NLUType.NUANCE_MIX]: {
    localesText: 'Language',
  },
};
