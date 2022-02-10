import { DFESConstants } from '@voiceflow/google-dfes-types';

const LOCALE_DISPLAY_NAMES: Record<DFESConstants.Language, string> = {
  [DFESConstants.Language.BN]: 'Bengali',
  [DFESConstants.Language.DA]: 'Danish',
  [DFESConstants.Language.DE]: 'German',
  [DFESConstants.Language.ES]: 'Spanish',
  [DFESConstants.Language.FI]: 'Finnish',
  [DFESConstants.Language.FIL]: ' Filipino',
  [DFESConstants.Language.FR]: 'French',
  [DFESConstants.Language.HI]: 'Hindi',
  [DFESConstants.Language.ID]: 'Indonesian',
  [DFESConstants.Language.IT]: 'Italian',
  [DFESConstants.Language.JA]: 'Japanese',
  [DFESConstants.Language.KO]: 'Korean (South Korea)',
  [DFESConstants.Language.MR]: 'Marathi',
  [DFESConstants.Language.MS]: 'Malay',
  [DFESConstants.Language.NL]: 'Dutch',
  [DFESConstants.Language.NO]: 'Norwegian',
  [DFESConstants.Language.PL]: 'Polish',
  [DFESConstants.Language.PT]: 'Portuguese (European)',
  [DFESConstants.Language.BR]: 'Portuguese (Brazilian)',
  [DFESConstants.Language.RO]: 'Romanian',
  [DFESConstants.Language.RU]: 'Russian',
  [DFESConstants.Language.SI]: 'Sinhala',
  [DFESConstants.Language.SV]: 'Swedish',
  [DFESConstants.Language.TA]: 'Tamil',
  [DFESConstants.Language.TE]: 'Telugu',
  [DFESConstants.Language.TH]: 'Thai',
  [DFESConstants.Language.TR]: 'Turkish',
  [DFESConstants.Language.UK]: 'Ukrainian',
  [DFESConstants.Language.VI]: 'Vietnamese',
  [DFESConstants.Language.CN]: 'Chinese (Simplified)',
  [DFESConstants.Language.HK]: 'Chinese (Hong Kong)',
  [DFESConstants.Language.TW]: 'Chinese (Traditional)',
  [DFESConstants.Language.EN]: 'English (EN)',
};

export const FORMATTED_DIALOGFLOW_LOCALES: { value: DFESConstants.Language; name: string }[] = Object.keys(DFESConstants.Language).map((key) => ({
  value: DFESConstants.Language[key as keyof typeof DFESConstants.Language],
  name: LOCALE_DISPLAY_NAMES[DFESConstants.Language[key as keyof typeof DFESConstants.Language]],
}));

export const FORMATTED_DIALOGFLOW_LOCALES_LABELS: Record<string, string> = FORMATTED_DIALOGFLOW_LOCALES.reduce<Record<string, string>>(
  (acc, locale) => Object.assign(acc, { [locale.value]: locale.name }),
  {}
);

export const getDialogflowLocaleLanguage = (locales: DFESConstants.Locale[] = []): DFESConstants.Language =>
  (Object.keys(DFESConstants.LanguageToLocale).find((language) =>
    DFESConstants.LanguageToLocale[language as DFESConstants.Language].includes(locales?.[0])
  ) as DFESConstants.Language) || (DFESConstants.Language.EN as DFESConstants.Language);
