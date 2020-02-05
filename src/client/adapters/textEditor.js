import _isString from 'lodash/isString';

import { SLOT_REGEXP } from '@/constants';

import { draftJSContentAdapter } from './draft';

export const matchVariables = (text = '') => {
  if (Array.isArray(text)) {
    return text;
  }

  const matches = [...text.matchAll(SLOT_REGEXP)];

  if (matches.length === 0) {
    return [text];
  }

  const parsed = [];

  matches.forEach((match, i) => {
    if (i === 0) {
      parsed.push(text.substring(i, match.index));
    } else {
      const prevMatch = matches[i - 1];
      parsed.push(text.substring(prevMatch.index + prevMatch[0].length, match.index));
    }

    if (match[1] && match[2]) {
      parsed.push({ id: match[2], name: match[1] });
    } else {
      parsed.push(match[0]);
    }
  });

  const lastMatch = matches[matches.length - 1];

  parsed.push(text.substring(lastMatch.index + lastMatch[0].length, text.length));

  return parsed;
};

export const textEditorContentAdapter = {
  toDB: (content) => draftJSContentAdapter.toDB(matchVariables(content)),
  fromDB: (content) =>
    draftJSContentAdapter
      .fromDB(content)
      .map((val) => (_isString(val) ? val : `{{[${val.name}].${val.name}}}`))
      .join(''),
};
