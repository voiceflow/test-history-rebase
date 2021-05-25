import * as Google from '@voiceflow/google-types';

const LOCALE_DISPLAY_NAMES: Record<Google.Language, string> = {
  [Google.Language.HK]: 'Chinese-Cantonese (zh-HK)',
  [Google.Language.TW]: 'Chinese-Traditional (zh-TW)',
  [Google.Language.DA]: 'Danish (da)',
  [Google.Language.NL]: 'Dutch (nl)',
  [Google.Language.EN]: 'English (en)',
  [Google.Language.FR]: 'French (fr)',
  [Google.Language.DE]: 'German (de)',
  [Google.Language.HI]: 'Hindi (hi)',
  [Google.Language.ID]: 'Indonesian (id)',
  [Google.Language.IT]: 'Italian (it)',
  [Google.Language.JA]: 'Japanese (ja)',
  [Google.Language.KO]: 'Korean (ko)',
  [Google.Language.NO]: 'Norwegian (no)',
  [Google.Language.PL]: 'Polish (pl)',
  [Google.Language.PT]: 'Portuguese (Brazilian) (pt)',
  [Google.Language.RU]: 'Russian (ru)',
  [Google.Language.ES]: 'Spanish (es)',
  [Google.Language.SV]: 'Swedish (sv)',
  [Google.Language.TH]: 'Thai (th)',
  [Google.Language.TR]: 'Turkish (tr)',
};

export const FORMATTED_LOCALES: { value: Google.Language; name: string }[] = Object.keys(Google.Language).map((key) => ({
  value: Google.Language[key as keyof typeof Google.Language],
  name: LOCALE_DISPLAY_NAMES[Google.Language[key as keyof typeof Google.Language]],
}));

export const FORMATTED_GOOGLE_LOCALES_LABELS: Record<string, string> = FORMATTED_LOCALES.reduce<Record<string, string>>(
  (acc, locale) => Object.assign(acc, { [locale.value]: locale.name }),
  {}
);

export const getLocaleLanguage = (locales: Google.Locale[] = []): Google.Language =>
  (Object.keys(Google.LanguageToLocale).find((language) =>
    Google.LanguageToLocale[language as Google.Language].includes(locales?.[0])
  ) as Google.Language) || (Google.Language.EN as Google.Language);
