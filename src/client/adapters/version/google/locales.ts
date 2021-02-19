import { Language, LanguageToLocale, Locale } from '@voiceflow/google-types';

const localesAdapter = (locales: Language[] | Locale[]) => LanguageToLocale[locales[0] as Language] || locales;

export default localesAdapter;
