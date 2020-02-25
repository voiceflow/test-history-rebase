import { genKey } from 'draft-js';
import _isString from 'lodash/isString';

import { SLOT_REGEXP } from '@/constants';
import { transformVariablesFromReadable } from '@/utils/slot';

import { EntityType, Mutability } from '../../constants';

export const matchVariables = (text = '', fromPastedText = false) => {
  if (Array.isArray(text)) {
    return text;
  }

  const textWithFormatedVars = transformVariablesFromReadable(text);

  const matches = [...textWithFormatedVars.matchAll(SLOT_REGEXP)];

  if (matches.length === 0) {
    return [textWithFormatedVars];
  }

  const parsed = [];

  matches.forEach((match, i) => {
    if (i === 0) {
      parsed.push(textWithFormatedVars.substring(i, match.index));
    } else {
      const prevMatch = matches[i - 1];
      parsed.push(textWithFormatedVars.substring(prevMatch.index + prevMatch[0].length, match.index));
    }

    if (match[1] && (fromPastedText || match[2])) {
      parsed.push({ id: match[2], name: match[1] });
    } else {
      parsed.push(match[0]);
    }
  });

  const lastMatch = matches[matches.length - 1];

  parsed.push(textWithFormatedVars.substring(lastMatch.index + lastMatch[0].length, textWithFormatedVars.length));

  return parsed;
};

const fromTextConvertor = () => ({ variables = [] } = {}) => (next) => (value, { cursor, entityMap, entityRanges }) => {
  const matchedVariables = matchVariables(value);
  let nextCursor = cursor;

  const variablesIdMap = variables.reduce((obj, variable) => Object.assign(obj, { [variable.id]: variable }), {});
  const variablesNameMap = variables.reduce((obj, variable) => Object.assign(obj, { [variable.name]: variable }), {});

  return matchedVariables.reduce((text, data) => {
    if (_isString(data)) {
      const nextStr = next(data, { cursor: nextCursor, entityMap, entityRanges }); // eslint-disable-line callback-return
      nextCursor += nextStr.length;

      return text + nextStr;
    }

    const key = genKey();
    const entity = variablesIdMap[data.id] || variablesNameMap[data.name];

    const strEntity = entity ? `{${entity.name}}` : `{${data.name}}`;

    if (entity) {
      entityMap[key] = {
        type: EntityType.VARIABLE,
        data: { mention: entity },
        mutability: Mutability.IMMUTABLE,
      };

      entityRanges.push({
        key,
        offset: nextCursor,
        length: strEntity.length,
      });
    }

    nextCursor += strEntity.length;

    return text + strEntity;
  }, '');
};

export default fromTextConvertor;
