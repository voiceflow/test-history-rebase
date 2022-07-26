const SPACE_REGEXP = / /g;
const LUIS_NOT_VALID_CHARS_REGEXP = /[$%&()*+:?~]/g;
const ALEXA_NOT_VALID_CHARS_REGEXP = /[^A-Z_a-z]/g;

export const applyAlexaIntentNameFormatting = (name = ''): string =>
  name.replace(SPACE_REGEXP, '_').replace(ALEXA_NOT_VALID_CHARS_REGEXP, '').toLowerCase();

export const applyLUISIntentNameFormatting = (name = ''): string => name.replace(LUIS_NOT_VALID_CHARS_REGEXP, '');
