import { Constants as AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { Constants as GeneralConstants } from '@voiceflow/general-types';
import { Constants as DialogflowConstants } from '@voiceflow/google-dfes-types';
import { Constants as GoogleConstants } from '@voiceflow/google-types';

import { getPlatformValue } from './platform';

interface VoiceOption<V> {
  value: V;
  label: string;
}

interface VoiceOptionGroup<V> {
  label: string;
  value?: string;
  options: Array<VoiceOptionGroup<V> | VoiceOption<V>>;
}

interface GetVoiceOptionsParams {
  locales?: string[];
  useWavenet?: boolean;
}

const DEFAULT_VOICE_CODE = 'default';

// ex inbound string standard-B
export const prettifyGoogleVoicesShort = (voiceCode: string): string => {
  if (voiceCode === DEFAULT_VOICE_CODE) return voiceCode;

  const splitCode = voiceCode.split('-');
  const voiceType = splitCode[2];
  const voiceTypeVariant = splitCode[3];

  return `${Utils.string.capitalizeFirstLetter(voiceType)} ${voiceTypeVariant}`.trim();
};

// ex inbound string en-GB-standard-B
export const prettifyGoogleVoicesLong = (voiceCode: string): string => {
  if (voiceCode === DEFAULT_VOICE_CODE) return voiceCode;
  const splitCode = voiceCode.split('-');

  const localeCode = `${splitCode[0]}-${splitCode[1]}` as GoogleConstants.Locale;
  const voiceType = `${Utils.string.capitalizeFirstLetter(splitCode[2])} ${splitCode[3]}`;

  return `${GoogleConstants.LocaleCodeToCountryLanguage[localeCode] || localeCode || ''} ${voiceType}`.trim();
};

export const prettifyAzureVoiceID = (voiceID: string): string => voiceID.split('-')[3].replace('RUS', '').replace('azure-', '');

export const prettifyVoice = (voiceID: string): string => {
  const lowerCasedVoiceID = voiceID.toLowerCase();

  // As we add more voices from different platforms, we can add to this util to prettify any voice ID
  if (lowerCasedVoiceID.includes('azure')) return prettifyAzureVoiceID(voiceID);
  if (lowerCasedVoiceID.includes('standard') || lowerCasedVoiceID.includes('wavenet')) return prettifyGoogleVoicesLong(voiceID);

  return voiceID;
};

export const getAlexaVoiceOptions = (): VoiceOptionGroup<AlexaConstants.Voice>[] =>
  AlexaConstants.REGIONAL_VOICE.map(({ label, options }) => ({
    label,
    options: options.map((voice) => ({ label: voice, value: voice })),
  }));

export const getGoogleVoiceOptions = ({ locales, useWavenet }: GetVoiceOptionsParams = {}): VoiceOptionGroup<string>[] => {
  const localeMeta =
    locales?.map((locale) => ({
      locale,
      languageCode: GoogleConstants.LocaleToVoiceLanguageCode[locale as GoogleConstants.Locale] ?? GoogleConstants.VoiceLanguageCode.EN_US,
    })) ?? [];

  const getLangOptions = (languageCode: GoogleConstants.VoiceLanguageCode) =>
    GoogleConstants.VoiceLanguageCodeToVoice[languageCode].flatMap(({ voiceName }) =>
      voiceName
        .filter((voiceName) => useWavenet || voiceName.includes(GoogleConstants.VoiceType.STANDARD))
        .map((voiceName) => ({ value: voiceName, label: prettifyGoogleVoicesShort(voiceName) }))
    );

  return localeMeta.map(({ locale, languageCode }) => ({
    label: GoogleConstants.LocaleCodeToCountryLanguage[locale as GoogleConstants.Locale] || locale,
    options: getLangOptions(languageCode),
  }));
};

export const getGoogleDialogflowVoiceOptions = (): VoiceOptionGroup<string>[] => {
  const allDialogflowLocales = Object.values(DialogflowConstants.Locale);

  const localeMeta = allDialogflowLocales.map((locale) => ({
    locale,
    languageCode: DialogflowConstants.LocaleToVoiceLanguageCode[locale] ?? DialogflowConstants.VoiceLanguageCode.EN_US,
  }));

  const getLangOptions = (languageCode: DialogflowConstants.VoiceLanguageCode) =>
    DialogflowConstants.VoiceLanguageCodeToVoice[languageCode].flatMap(({ voiceName }) =>
      voiceName
        .filter((voiceName) => voiceName.includes(GoogleConstants.VoiceType.STANDARD))
        .map((voiceName) => ({ value: voiceName, label: prettifyGoogleVoicesShort(voiceName) }))
    );

  return localeMeta
    .filter(({ locale }) => DialogflowConstants.LocaleCodeToCountryLanguage[locale])
    .map(({ locale, languageCode }) => ({
      label: DialogflowConstants.LocaleCodeToCountryLanguage[locale]!,
      options: getLangOptions(languageCode),
    }));
};

export const getAzureVoiceOptions = (): VoiceOptionGroup<string>[] =>
  Object.values(GeneralConstants.AZURE_LOCALE_VOICE_META).map(({ language, voices }) => ({
    value: language,
    label: language,
    options: voices.map(({ voiceID }) => ({ value: voiceID, label: prettifyAzureVoiceID(voiceID) })),
  }));

export const getGeneralVoiceOptions = ({ useWavenet }: GetVoiceOptionsParams = {}): VoiceOptionGroup<string>[] => {
  const allGoogleLocales = Object.values(GoogleConstants.Locale);

  return [
    {
      value: 'Amazon',
      label: 'Amazon',
      options: getAlexaVoiceOptions(),
    },
    {
      value: Utils.string.capitalizeFirstLetter(GeneralConstants.PlatformType.GOOGLE),
      label: Utils.string.capitalizeFirstLetter(GeneralConstants.PlatformType.GOOGLE),
      options: getGoogleVoiceOptions({ locales: allGoogleLocales, useWavenet }),
    },
    {
      value: 'Microsoft',
      label: 'Microsoft',
      options: getAzureVoiceOptions(),
    },
  ];
};

export const getPlatformVoiceOptions = (platform: GeneralConstants.PlatformType, params: GetVoiceOptionsParams): VoiceOptionGroup<string>[] =>
  getPlatformValue(
    platform,
    {
      [GeneralConstants.PlatformType.ALEXA]: getAlexaVoiceOptions,
      [GeneralConstants.PlatformType.GOOGLE]: getGoogleVoiceOptions,
      [GeneralConstants.PlatformType.DIALOGFLOW_ES_VOICE]: getGoogleDialogflowVoiceOptions,
    },
    getGeneralVoiceOptions
  )(params);

export const voiceOptionsFilter = (
  voiceOptions: VoiceOptionGroup<string>[],
  searchLabel?: string
): { matchedOptions: VoiceOptionGroup<string>[]; filteredOptions: VoiceOptionGroup<string>[]; notMatchedOptions: VoiceOptionGroup<string>[] } => {
  if (!searchLabel?.trim()) {
    return { matchedOptions: voiceOptions, filteredOptions: voiceOptions, notMatchedOptions: [] };
  }

  const lowerCasedSearchLabel = searchLabel.toLowerCase();

  const filterChildren = (options: Array<VoiceOptionGroup<string> | VoiceOption<string>>): Array<VoiceOptionGroup<string> | VoiceOption<string>> =>
    options.reduce<Array<VoiceOptionGroup<string> | VoiceOption<string>>>((acc, option) => {
      if (option.label?.toLowerCase().includes(lowerCasedSearchLabel)) {
        return [...acc, option];
      }

      if (!('options' in option) || !option.options.length) {
        return acc;
      }

      const filteredChildren = filterChildren(option.options);

      return filteredChildren.length ? [...acc, { ...option, options: filteredChildren }] : acc;
    }, []);

  const matchedOptions = filterChildren(voiceOptions) as VoiceOptionGroup<string>[];

  return { matchedOptions, filteredOptions: matchedOptions, notMatchedOptions: [] };
};
