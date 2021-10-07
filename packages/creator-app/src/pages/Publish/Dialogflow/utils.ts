import { Constants } from '@voiceflow/google-dfes-types';

const LOCALE_DISPLAY_NAMES: Record<Constants.Language, string> = {
  [Constants.Language.BN]: 'Bengali',
  [Constants.Language.DA]: 'Danish',
  [Constants.Language.DE]: 'German',
  [Constants.Language.ES]: 'Spanish',
  [Constants.Language.FI]: 'Finnish',
  [Constants.Language.FIL]: ' Filipino',
  [Constants.Language.FR]: 'French',
  [Constants.Language.HI]: 'Hindi',
  [Constants.Language.ID]: 'Indonesian',
  [Constants.Language.IT]: 'Italian',
  [Constants.Language.JA]: 'Japanese',
  [Constants.Language.KO]: 'Korean (South Korea)',
  [Constants.Language.MR]: 'Marathi',
  [Constants.Language.MS]: 'Malay',
  [Constants.Language.NL]: 'Dutch',
  [Constants.Language.NO]: 'Norwegian',
  [Constants.Language.PL]: 'Polish',
  [Constants.Language.PT]: 'Portuguese (European)',
  [Constants.Language.BR]: 'Portuguese (Brazilian)',
  [Constants.Language.RO]: 'Romanian',
  [Constants.Language.RU]: 'Russian',
  [Constants.Language.SI]: 'Sinhala',
  [Constants.Language.SV]: 'Swedish',
  [Constants.Language.TA]: 'Tamil',
  [Constants.Language.TE]: 'Telugu',
  [Constants.Language.TH]: 'Thai',
  [Constants.Language.TR]: 'Turkish',
  [Constants.Language.UK]: 'Ukrainian',
  [Constants.Language.VI]: 'Vietnamese',
  [Constants.Language.CN]: 'Chinese (Simplified)',
  [Constants.Language.HK]: 'Chinese (Hong Kong)',
  [Constants.Language.TW]: 'Chinese (Traditional)',
  [Constants.Language.EN]: 'English (EN)',
};

export const FORMATTED_DIALOGFLOW_LOCALES: { value: Constants.Language; name: string }[] = Object.keys(Constants.Language).map((key) => ({
  value: Constants.Language[key as keyof typeof Constants.Language],
  name: LOCALE_DISPLAY_NAMES[Constants.Language[key as keyof typeof Constants.Language]],
}));

export const FORMATTED_DIALOGFLOW_LOCALES_LABELS: Record<string, string> = FORMATTED_DIALOGFLOW_LOCALES.reduce<Record<string, string>>(
  (acc, locale) => Object.assign(acc, { [locale.value]: locale.name }),
  {}
);

export const getDialogflowLocaleLanguage = (locales: Constants.Locale[] = []): Constants.Language =>
  (Object.keys(Constants.LanguageToLocale).find((language) =>
    Constants.LanguageToLocale[language as Constants.Language].includes(locales?.[0])
  ) as Constants.Language) || (Constants.Language.EN as Constants.Language);
