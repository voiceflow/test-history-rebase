import { Constants } from '@voiceflow/google-types';

const LOCALE_DISPLAY_NAMES: Record<Constants.Language, string> = {
  [Constants.Language.HK]: 'Chinese-Cantonese (zh-HK)',
  [Constants.Language.TW]: 'Chinese-Traditional (zh-TW)',
  [Constants.Language.DA]: 'Danish (da)',
  [Constants.Language.NL]: 'Dutch (nl)',
  [Constants.Language.EN]: 'English (en)',
  [Constants.Language.FR]: 'French (fr)',
  [Constants.Language.DE]: 'German (de)',
  [Constants.Language.HI]: 'Hindi (hi)',
  [Constants.Language.ID]: 'Indonesian (id)',
  [Constants.Language.IT]: 'Italian (it)',
  [Constants.Language.JA]: 'Japanese (ja)',
  [Constants.Language.KO]: 'Korean (ko)',
  [Constants.Language.NO]: 'Norwegian (no)',
  [Constants.Language.PL]: 'Polish (pl)',
  [Constants.Language.PT]: 'Portuguese (Brazilian) (pt)',
  [Constants.Language.RU]: 'Russian (ru)',
  [Constants.Language.ES]: 'Spanish (es)',
  [Constants.Language.SV]: 'Swedish (sv)',
  [Constants.Language.TH]: 'Thai (th)',
  [Constants.Language.TR]: 'Turkish (tr)',
};

export const FORMATTED_LOCALES: { value: Constants.Language; name: string }[] = Object.keys(Constants.Language).map((key) => ({
  value: Constants.Language[key as keyof typeof Constants.Language],
  name: LOCALE_DISPLAY_NAMES[Constants.Language[key as keyof typeof Constants.Language]],
}));

export const FORMATTED_GOOGLE_LOCALES_LABELS: Record<string, string> = FORMATTED_LOCALES.reduce<Record<string, string>>(
  (acc, locale) => Object.assign(acc, { [locale.value]: locale.name }),
  {}
);

export const getLocaleLanguage = (locales: Constants.Locale[] = []): Constants.Language =>
  (Object.keys(Constants.LanguageToLocale).find((language) =>
    Constants.LanguageToLocale[language as Constants.Language].includes(locales?.[0])
  ) as Constants.Language) || (Constants.Language.EN as Constants.Language);
