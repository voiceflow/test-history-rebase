import { GoogleConstants } from '@voiceflow/google-types';

const localesAdapter = (locales: GoogleConstants.Language[] | GoogleConstants.Locale[]): GoogleConstants.Locale[] =>
  GoogleConstants.LanguageToLocale[locales[0] as GoogleConstants.Language] || locales;

export default localesAdapter;
