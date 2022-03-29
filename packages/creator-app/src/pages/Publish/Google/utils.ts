import { GoogleConstants } from '@voiceflow/google-types';

import { createPreferredOptionsList } from '@/pages/Publish/utils';

const LOCALE_DISPLAY_NAMES: Record<GoogleConstants.Language, string> = {
  [GoogleConstants.Language.HK]: 'Chinese-Cantonese (zh-HK)',
  [GoogleConstants.Language.TW]: 'Chinese-Traditional (zh-TW)',
  [GoogleConstants.Language.DA]: 'Danish (da)',
  [GoogleConstants.Language.NL]: 'Dutch (nl)',
  [GoogleConstants.Language.EN]: 'English (en)',
  [GoogleConstants.Language.FR]: 'French (fr)',
  [GoogleConstants.Language.DE]: 'German (de)',
  [GoogleConstants.Language.HI]: 'Hindi (hi)',
  [GoogleConstants.Language.ID]: 'Indonesian (id)',
  [GoogleConstants.Language.IT]: 'Italian (it)',
  [GoogleConstants.Language.JA]: 'Japanese (ja)',
  [GoogleConstants.Language.KO]: 'Korean (ko)',
  [GoogleConstants.Language.NO]: 'Norwegian (no)',
  [GoogleConstants.Language.PL]: 'Polish (pl)',
  [GoogleConstants.Language.PT]: 'Portuguese (Brazilian) (pt)',
  [GoogleConstants.Language.RU]: 'Russian (ru)',
  [GoogleConstants.Language.ES]: 'Spanish (es)',
  [GoogleConstants.Language.SV]: 'Swedish (sv)',
  [GoogleConstants.Language.TH]: 'Thai (th)',
  [GoogleConstants.Language.TR]: 'Turkish (tr)',
};

interface LocaleItemProp {
  value: GoogleConstants.Language;
  name: string;
}

export const FORMATTED_LOCALES: LocaleItemProp[] = Object.keys(GoogleConstants.Language).map((key) => ({
  value: GoogleConstants.Language[key as keyof typeof GoogleConstants.Language],
  name: LOCALE_DISPLAY_NAMES[GoogleConstants.Language[key as keyof typeof GoogleConstants.Language]],
}));

export const getPreferredGoogleLocales = () => createPreferredOptionsList(FORMATTED_LOCALES, [GoogleConstants.Language.EN]);

export const FORMATTED_GOOGLE_LOCALES_LABELS: Record<string, string> = FORMATTED_LOCALES.reduce<Record<string, string>>(
  (acc, locale) => Object.assign(acc, { [locale.value]: locale.name }),
  {}
);

export const getLocaleLanguage = (locales: GoogleConstants.Locale[] = []): GoogleConstants.Language =>
  (Object.keys(GoogleConstants.LanguageToLocale).find((language) =>
    GoogleConstants.LanguageToLocale[language as GoogleConstants.Language].includes(locales?.[0])
  ) as GoogleConstants.Language) || (GoogleConstants.Language.EN as GoogleConstants.Language);
