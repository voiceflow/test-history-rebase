import { Constants } from '@voiceflow/google-types';

const localesAdapter = (locales: Constants.Language[] | Constants.Locale[]): Constants.Locale[] =>
  Constants.LanguageToLocale[locales[0] as Constants.Language] || locales;

export default localesAdapter;
