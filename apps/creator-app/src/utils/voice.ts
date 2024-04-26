import { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

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
  usePremiumVoice?: boolean;
}

const DEFAULT_VOICE_CODE = 'default';

// ex inbound string standard-B
const prettifyGoogleVoicesShort = (voiceCode: string): string => {
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

const prettifyAzureVoiceID = (voiceID: string): string => voiceID.split('-')[2].replace('Neural', '');

export const prettifyVoice = (voiceID: string): string => {
  const lowerCasedVoiceID = voiceID.toLowerCase();

  // As we add more voices from different platforms, we can add to this util to prettify any voice ID
  if (
    lowerCasedVoiceID.includes('standard') ||
    lowerCasedVoiceID.includes('wavenet') ||
    lowerCasedVoiceID.includes('neural2')
  )
    return prettifyGoogleVoicesLong(voiceID);
  if (lowerCasedVoiceID.includes('neural')) return prettifyAzureVoiceID(voiceID);

  return voiceID;
};

export const getAlexaVoiceOptions = (): VoiceOptionGroup<AlexaConstants.Voice>[] =>
  AlexaConstants.REGIONAL_VOICE.map(({ label, options }) => ({
    label,
    options: options.map((voice) => ({ label: voice, value: voice })),
  }));

export const getGoogleVoiceOptions = ({
  locales,
  usePremiumVoice,
}: GetVoiceOptionsParams = {}): VoiceOptionGroup<string>[] => {
  const localeMeta =
    locales?.map((locale) => ({
      locale,
      languageCode:
        GoogleConstants.LocaleToVoiceLanguageCode[locale as GoogleConstants.Locale] ??
        GoogleConstants.VoiceLanguageCode.EN_US,
    })) ?? [];

  const getLangOptions = (languageCode: GoogleConstants.VoiceLanguageCode) =>
    GoogleConstants.VoiceLanguageCodeToVoice[languageCode].flatMap(({ voiceName }) =>
      voiceName
        .filter((voiceName) => usePremiumVoice || voiceName.includes(GoogleConstants.VoiceType.STANDARD))
        .map((voiceName) => ({ value: voiceName, label: prettifyGoogleVoicesShort(voiceName) }))
    );

  return localeMeta
    .filter(({ locale, languageCode }) => locale === languageCode) // only show language options if the locale is the same as the language
    .map(({ locale, languageCode }) => ({
      label: GoogleConstants.LocaleCodeToCountryLanguage[locale as GoogleConstants.Locale] || locale,
      options: getLangOptions(languageCode),
    }));
};

export const getGoogleDialogflowVoiceOptions = ({
  locales,
  usePremiumVoice,
}: GetVoiceOptionsParams = {}): VoiceOptionGroup<string>[] => {
  const localeMeta =
    locales?.map((locale) => ({
      locale,
      languageCode:
        DFESConstants.LocaleToVoiceLanguageCode[locale as DFESConstants.Locale] ??
        DFESConstants.VoiceLanguageCode.EN_US,
    })) ?? [];

  const getLangOptions = (languageCode: DFESConstants.VoiceLanguageCode) =>
    DFESConstants.VoiceLanguageCodeToVoice[languageCode].flatMap(({ voiceName }) =>
      voiceName
        .filter((voiceName) => usePremiumVoice || voiceName.includes(GoogleConstants.VoiceType.STANDARD))
        .map((voiceName) => ({ value: voiceName, label: prettifyGoogleVoicesShort(voiceName) }))
    );

  return localeMeta
    .filter(({ locale, languageCode }) => locale === languageCode || locale === languageCode.split('-')[0])
    .map(({ locale, languageCode }) => ({
      label: DFESConstants.LocaleCodeToCountryLanguage[locale as DFESConstants.Locale]!,
      options: getLangOptions(languageCode),
    }));
};

const getAzureVoiceOptions = (): VoiceOptionGroup<string>[] =>
  Object.values(VoiceflowConstants.AZURE_LOCALE_VOICE_META).map(({ language, voices }) => ({
    value: language,
    label: language,
    options: voices.map(({ voiceID }) => ({ value: voiceID, label: prettifyAzureVoiceID(voiceID) })),
  }));

export const isAzureVoiceOption = (voiceID: string): boolean => {
  return Object.values(VoiceflowConstants.AZURE_LOCALE_VOICE_META).some(
    ({ voices }: { voices: { gender: string; voiceID: string }[] }) => voices.some((voice) => voice.voiceID === voiceID)
  );
};

export const getGeneralVoiceOptions = ({ usePremiumVoice }: GetVoiceOptionsParams = {}): VoiceOptionGroup<string>[] => {
  const allGoogleLocales = Object.values(GoogleConstants.Locale);
  return [
    {
      value: 'Amazon',
      label: 'Amazon',
      options: getAlexaVoiceOptions(),
    },
    {
      value: Utils.string.capitalizeFirstLetter(Platform.Constants.PlatformType.GOOGLE),
      label: Utils.string.capitalizeFirstLetter(Platform.Constants.PlatformType.GOOGLE),
      options: getGoogleVoiceOptions({ locales: allGoogleLocales, usePremiumVoice }),
    },
    {
      value: 'Microsoft',
      label: 'Microsoft',
      options: getAzureVoiceOptions(),
    },
  ];
};

export const getPlatformVoiceOptions = (
  platform: Platform.Constants.PlatformType,
  params: GetVoiceOptionsParams
): VoiceOptionGroup<string>[] =>
  getPlatformValue(
    platform,
    {
      [Platform.Constants.PlatformType.ALEXA]: getAlexaVoiceOptions,
      [Platform.Constants.PlatformType.GOOGLE]: getGoogleVoiceOptions,
      [Platform.Constants.PlatformType.DIALOGFLOW_ES]: getGoogleDialogflowVoiceOptions,
    },
    getGeneralVoiceOptions
  )(params);

const isVoiceOptionsGroup = <V>(options: VoiceOptionGroup<V> | VoiceOption<V>): options is VoiceOptionGroup<V> => {
  return !!(options as VoiceOptionGroup<V>).options;
};

export const bindVoiceOptions = (
  voiceOptions: VoiceOptionGroup<string>[],
  fn: (option: VoiceOption<string>) => VoiceOption<string>
) => {
  // apply onClick to all leaf option nodes
  const recurse = (options: VoiceOptionGroup<string>['options']) => {
    options.forEach((option, index) => {
      if (isVoiceOptionsGroup(option)) {
        recurse(option.options);
      } else {
        options[index] = fn(option);
      }
    });
  };

  recurse(voiceOptions);

  return voiceOptions;
};

export const voiceOptionsFilter = (
  voiceOptions: VoiceOptionGroup<string>[],
  searchLabel?: string
): {
  matchedOptions: VoiceOptionGroup<string>[];
  filteredOptions: VoiceOptionGroup<string>[];
  notMatchedOptions: VoiceOptionGroup<string>[];
} => {
  if (!searchLabel?.trim()) {
    return { matchedOptions: voiceOptions, filteredOptions: voiceOptions, notMatchedOptions: [] };
  }

  const lowerCasedSearchLabel = searchLabel.toLowerCase();

  const filterChildren = (
    options: Array<VoiceOptionGroup<string> | VoiceOption<string>>
  ): Array<VoiceOptionGroup<string> | VoiceOption<string>> =>
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
