import { constants } from '@voiceflow/common';
import React from 'react';

import { LAUNCH_PHRASES, WAKE_WORDS } from './Constants';

const { validLatinChars, validSpokenCharacters, validCharacters } = constants.regex;

export const loading = (message) => {
  return (
    <div className="super-center mb-4">
      <div className="text-center">
        <p className="mb-0">{message}</p>
      </div>
    </div>
  );
};

export const Video = (link, className) => {
  return (
    <div className={`mt-3 rounded overflow-hidden ${className || 'w-100'}`}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video className="rounded w-100 overflow-hidden" controls>
        <source src={link} type="video/mp4" />
      </video>
    </div>
  );
};

export const matchesKeyword = (splitName) => (l) =>
  splitName.find((split) => {
    return split === l.toLowerCase();
  });

export const invNameError = (name, locales) => {
  if (!name || !name.trim()) {
    return 'Invocation name required for Alexa';
  }
  let characters = validLatinChars;
  let error = `[${locales
    .filter((l) => l !== 'jp-JP')
    .join(',')}] Invocation name may only contain Latin characters, apostrophes, periods and spaces`;
  if (locales.length === 1 && locales[0] === 'ja-JP') {
    characters = validSpokenCharacters;
    error = 'Invocation name may only contain Japanese/English characters, apostrophes, periods and spaces';
  } else if (locales.some((l) => l.includes('en'))) {
    // If an English Skill No Accents Allowed
    error = `[${locales
      .filter((l) => l.includes('en'))
      .join(',')}] Invocation name may only contain alphabetic characters, apostrophes, periods and spaces`;
    characters = validCharacters;
  }

  const validRegex = `[^${characters}.' ]+`;
  const match = name.match(validRegex);
  const split_name = name.split(' ').map((splits) => {
    return splits.toLowerCase();
  });
  if (match) {
    return `${error} - Invalid Characters: "${match.join()}"`;
  }
  if (WAKE_WORDS.some(matchesKeyword(split_name))) {
    return `Invocation name cannot contain Alexa keywords e.g. ${WAKE_WORDS.join(', ')}`;
  }
  if (LAUNCH_PHRASES.some(matchesKeyword(split_name))) {
    return `Invocation name cannot contain Launch Phrases e.g. ${LAUNCH_PHRASES.join(', ')}`;
  }
  return null;
};
