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
  return `${LocaleCodeToCountryLanguage[localeCode as Locale] || localeCode || ''} ${voiceType}`;
};

export const prettifyAzureVoiceID = (voiceID: string) => voiceID.split('-')[3].replace('RUS', '').replace('azure-', '');

export const prettifyVoice = (voiceID: string) => {
  const lowerCasedVoiceID = voiceID.toLowerCase();
  // As we add more voices from different platforms, we can add to this util to prettify any voice ID
  if (lowerCasedVoiceID.includes('azure')) return prettifyAzureVoiceID(voiceID);
  if (lowerCasedVoiceID.includes('standard') || lowerCasedVoiceID.includes('wavenet')) return prettifyGoogleVoicesLong(voiceID);
  return voiceID;
};
