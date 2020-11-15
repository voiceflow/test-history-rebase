import { Locale } from '@voiceflow/alexa-types';
import { constants } from '@voiceflow/common';
import { LanguageToLocale, Locale as GoogleLocale } from '@voiceflow/google-types';

const { validLatinChars, validSpokenCharacters, validCharacters } = constants.regex;

const LAUNCH_PHRASES = ['launch', 'ask', 'tell', 'load', 'begin', 'enable'];
const ALEXA_WAKE_WORDS = ['Alexa', 'Amazon', 'Echo', 'Skill', 'App'];
const RESERVED_WORDS = ['ok', 'google', 'launch', 'ask', 'tell', 'load', 'game', 'action', 'assistant', 'skill', 'app'];
const RESERVED_PHRASES = ['exit quit', 'volume up'];

const NON_LATIN_REGIONS = ['ja-JP', 'hi-IN'];

const matchesKeyword = (splitName: string[]) => (keyword: string) => splitName.find((split) => split === keyword.toLowerCase());

const { GOOGLE_LOCALES } = constants.locales;

const L = GOOGLE_LOCALES;
const LOCALE_DISPLAY_NAMES = {
  [L.HK]: 'Chinese-Cantonese (zh-HK)',
  [L.CN]: 'Chinese-Simplified (zh-CN)',
  [L.TW]: 'Chinese-Traditional (zh-TW)',
  [L.DA]: 'Danish (da)',
  [L.NL]: 'Dutch (nl)',
  [L.EN]: 'English (en)',
  [L.FR]: 'French (fr)',
  [L.DE]: 'German (de)',
  [L.HI]: 'Hindi (hi)',
  [L.ID]: 'Indonesian (id)',
  [L.IT]: 'Italian (it)',
  [L.JA]: 'Japanese (ja)',
  [L.KO]: 'Korean (ko)',
  [L.NO]: 'Norwegian (no)',
  [L.PL]: 'Polish (pl)',
  [L.PT]: 'Portuguese (pt)',
  [L.BR]: 'Portuguese-Brazilian (pt-BR)',
  [L.RU]: 'Russian (ru)',
  [L.ES]: 'Spanish (es)',
  [L.SV]: 'Swedish (sv)',
  [L.TH]: 'Thai (th)',
  [L.TR]: 'Turkish (tr)',
  [L.UK]: 'Ukranian (uk)',
};

export const FORMATTED_LOCALES = Object.keys(GOOGLE_LOCALES).map((key) => {
  return { value: GOOGLE_LOCALES[key], name: LOCALE_DISPLAY_NAMES[GOOGLE_LOCALES[key]] };
});

export const GOOGLE_LANGUAGE_TO_LOCALES = LanguageToLocale as Record<string, GoogleLocale[]>;

// TODO: share the logic with the backend
export const getAmazonInvocationNameError = (name?: string, locales: Locale[] = []) => {
  if (!name?.trim()) {
    return 'Invocation name required for Alexa';
  }

  let invalidLocales = locales.filter((locale) => !NON_LATIN_REGIONS.includes(locale)).join(',');

  let error = `[${invalidLocales}] Invocation name may only contain Latin characters, apostrophes, periods and spaces`;
  let characters = validLatinChars;

  if (locales.length === 1 && NON_LATIN_REGIONS.includes(locales[0])) {
    error = 'Invocation name may only contain language characters, apostrophes, periods and spaces';

    characters = validSpokenCharacters;
  } else if (locales.some((locale) => locale.includes('en'))) {
    invalidLocales = locales.filter((locale) => locale.includes('en')).join(',');

    error = `[${invalidLocales}] Invocation name may only contain alphabetic characters, apostrophes, periods and spaces`;

    characters = validCharacters;
  }

  const validRegex = `[^${characters}.' ]+`;

  const match = name.match(validRegex);
  const splitName = name.split(' ').map((splits) => splits.toLowerCase());

  if (match) {
    return `${error} - Invalid Characters: "${match.join()}"`;
  }

  if (ALEXA_WAKE_WORDS.some(matchesKeyword(splitName))) {
    return `Invocation name cannot contain Alexa keywords e.g. ${ALEXA_WAKE_WORDS.join(', ')}`;
  }

  if (LAUNCH_PHRASES.some(matchesKeyword(splitName))) {
    return `Invocation name cannot contain Launch Phrases e.g. ${LAUNCH_PHRASES.join(', ')}`;
  }

  return null;
};

// TODO: share the logic with the backend
export const getGoogleInvocationNameError = (name?: string, locales: Locale[] = []) => {
  if (!name?.trim()) {
    return 'Invocation name required for Google';
  }

  let invalidLocales = locales.filter((locale) => !NON_LATIN_REGIONS.includes(locale)).join(',');

  let error = `[${invalidLocales}] Invocation name may only contain Latin characters, apostrophes, periods and spaces`;
  let characters = validLatinChars;

  if (locales.length === 1 && NON_LATIN_REGIONS.includes(locales[0])) {
    error = 'Invocation name may only contain language characters, apostrophes, periods and spaces';

    characters = validSpokenCharacters;
  } else if (locales.some((locale) => locale.includes('en'))) {
    invalidLocales = locales.filter((locale) => locale.includes('en')).join(',');

    error = `[${invalidLocales}] Invocation name may only contain alphabetic characters, apostrophes, periods and spaces`;

    characters = validCharacters;
  }

  const validRegex = `[^${characters}.' ]+`;

  const match = name.match(validRegex);
  const splitName = name.toLowerCase().split(' ');

  if (match) {
    return `${error} - Invalid Characters: "${match.join()}"`;
  }

  if (RESERVED_WORDS.some(matchesKeyword(splitName))) {
    return `Invocation name cannot contain reserved words e.g. ${RESERVED_WORDS.join(', ')}`;
  }

  if (RESERVED_PHRASES.some((phrase) => name.match(RegExp(`\b${phrase}\b`)))) {
    return `Invocation name cannot contain reserved phrases e.g. ${RESERVED_PHRASES.join(', ')}`;
  }

  return null;
};
