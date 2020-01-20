import { constants } from '@voiceflow/common';

const { validLatinChars, validSpokenCharacters, validCharacters } = constants.regex;

// the publish id changes midway through an async step do not allow any further dispatches
export const createUploadStep = (platform) => (callback) => (dispatch, getState) => {
  const publishId = getState().publish[platform].id;

  const overrideDispatch = (step) => {
    // only update if id is consistent
    if (getState().publish[platform].id === publishId) {
      return dispatch(step);
    }
  };

  return callback(overrideDispatch, getState);
};

export const createPublishStateSelector = (platform) => (state) => state.publish[platform];

const matchesKeyword = (splitName) => (l) =>
  splitName.find((split) => {
    return split === l.toLowerCase();
  });

// Determine if Invocation Name Valid
const LAUNCH_PHRASES = ['launch', 'ask', 'tell', 'load', 'begin', 'enable'];
const WAKE_WORDS = ['Alexa', 'Amazon', 'Echo', 'Skill', 'App'];

const NON_LATIN_REGIONS = ['jp-JP', 'hi-IN'];

// detect if an invocation name is invalid relative to the locales for the skill
export const invNameError = (name, locales) => {
  if (!name || !name.trim()) return 'Invocation name required for Alexa';
  let characters = validLatinChars;
  let error = `[${locales
    .filter((l) => !NON_LATIN_REGIONS.includes(l))
    .join(',')}] Invocation name may only contain Latin characters, apostrophes, periods and spaces`;
  if (locales.length === 1 && NON_LATIN_REGIONS.includes(locales[0])) {
    characters = validSpokenCharacters;
    error = 'Invocation name may only contain language characters, apostrophes, periods and spaces';
  } else if (locales.some((l) => l.includes('en'))) {
    // If an English Skill No Accents Allowed
    error = `[${locales
      .filter((l) => l.includes('en'))
      .join(',')}] Invocation name may only contain alphabetic characters, apostrophes, periods and spaces`;
    characters = validCharacters;
  }

  const validRegex = `[^${characters}.' ]+`;
  const match = name.match(validRegex);
  const splitName = name.split(' ').map((splits) => {
    return splits.toLowerCase();
  });
  if (match) {
    return `${error} - Invalid Characters: "${match.join()}"`;
  }
  if (WAKE_WORDS.some(matchesKeyword(splitName))) {
    return `Invocation name cannot contain Alexa keywords e.g. ${WAKE_WORDS.join(', ')}`;
  }
  if (LAUNCH_PHRASES.some(matchesKeyword(splitName))) {
    return `Invocation name cannot contain Launch Phrases e.g. ${LAUNCH_PHRASES.join(', ')}`;
  }
  return null;
};
