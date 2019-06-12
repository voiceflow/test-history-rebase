const geKey = (lang, separator = '_') => {
  switch (lang) {
    case 'english_gb':
      return `en${separator}GB`;
    case 'german':
      return `de${separator}DE`;
    case 'japanese':
      return `ja`;
    case 'english_ca':
      return `en${separator}CA`;
    case 'english_au':
      return `en${separator}AU`;
    case 'english_in':
      return `en${separator}IN`;
    case 'french':
      return `fr${separator}FR`;
    case 'spanish':
      return `es${separator}ES`;
    case 'italian':
      return `it${separator}IT`;
    case 'portuguese':
      return `pt${separator}BR`
    default:
      return `en${separator}US`;
  }
};

export const LANGUAGES = {
  'de-DE': "German (DE)",
  'en-AU': "English (AU)",
  'en-CA': "English (CA)",
  'en-GB': "English (UK)",
  'en-IN': "English (IN)",
  'en-US': "English (US)",
  'es-ES': "Spanish (ES)",
  'es-MX': "Spanish (MX)",
  'es-US': "Spanish (US)",
  'fr-CA': "French (CA)",
  'fr-FR': "French (FR)",
  'it-IT': "Italian (IT)",
  'ja-JP': "Japanese (JP)",
  'pt-BR': 'Portugese (BR)',
  // english: 'English (USA)',
  // english_gb: 'English (UK)',
  // english_ca: 'English (Canada)',
  // english_au: 'English (Australia)',
  // english_in: 'English (India)',
  // french: 'French',
  // german: 'German',
  // italian: 'Italian',
  // japanese: 'Japanese',
  // spanish: 'Spanish (ES)',
};

export const LANGUAGES_SHORT = {
  english: 'English (US)',
  english_gb: 'English (UK)',
  english_ca: 'English (CA)',
  english_au: 'English (AU)',
  english_in: 'English (IN)',
  french: 'French',
  german: 'German',
  italian: 'Italian',
  japanese: 'Japanese',
  spanish: 'Spanish (ES)',
  portuguese: 'Portuguese (BR)'
};

export const LANGUAGES_OPTIONS = Object.keys(LANGUAGES).reduce(
  (arr, key) => [...arr, { id: key, label: LANGUAGES[key] }],
  []
);

export const getLanguageDashKey = lang => geKey(lang, '-');
export const getLanguageUnderscoreKey = lang => geKey(lang, '_');

export const getHumanLanguageName = lang => LANGUAGES[lang];
export const getHumanLanguageShortName = lang => LANGUAGES_SHORT[lang];
