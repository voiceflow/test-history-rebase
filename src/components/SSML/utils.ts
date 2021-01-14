import { Locale, LocaleCodeToCountryLanguage } from '@voiceflow/google-types/build/constants/index';

import { capitalizeFirstLetter } from '@/utils/string';

// ex inbound string standard-B
export const prettifyGoogleVoicesShort = (voiceCode: string) => {
  if (voiceCode === 'default') return voiceCode;
  const splitCode = voiceCode.split('-');
  const voiceType = splitCode[2];
  const voiceTypeVariant = splitCode[3];

  return `${capitalizeFirstLetter(voiceType)} ${voiceTypeVariant}`;
};

// ex inbound string en-GB-standard-B
export const prettifyGoogleVoicesLong = (voiceCode: string) => {
  if (voiceCode === 'default') return voiceCode;
  const splitCode = voiceCode.split('-');

  const localeCode = `${splitCode[0]}-${splitCode[1]}`;
  const voiceType = `${capitalizeFirstLetter(splitCode[2])} ${splitCode[3]}`;
  return `${LocaleCodeToCountryLanguage[localeCode as Locale] || ''} ${voiceType}`;
};
