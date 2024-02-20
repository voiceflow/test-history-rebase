import { SLOT_REGEXP } from '@voiceflow/common';
import { genKey } from 'draft-js';
import _isString from 'lodash/isString';

import { transformVariablesFromReadable, transformVariablesFromReadableWithoutTrim } from '@/utils/slot';

import { EntityType, Mutability } from '../../constants';

export const matchVariables = (text = '', { withoutTrim } = {}) => {
  if (Array.isArray(text)) {
    return text;
  }

  // eslint-disable-next-line no-nested-ternary
  const textWithFormattedVars = text ? (withoutTrim ? transformVariablesFromReadableWithoutTrim(text) : transformVariablesFromReadable(text)) : '';

  const matches = [...textWithFormattedVars.matchAll(SLOT_REGEXP)];

  if (matches.length === 0) {
    return [textWithFormattedVars];
  }

  const parsed = [];

  matches.forEach((match, i) => {
    if (i === 0) {
      parsed.push(textWithFormattedVars.substring(i, match.index));
    } else {
      const prevMatch = matches[i - 1];
      parsed.push(textWithFormattedVars.substring(prevMatch.index + prevMatch[0].length, match.index));
    }

    if (match[1] && match[2]) {
      parsed.push({ id: match[2], name: match[1] });
    } else {
      parsed.push(match[0]);
    }
  });

  const lastMatch = matches[matches.length - 1];

  parsed.push(textWithFormattedVars.substring(lastMatch.index + lastMatch[0].length, textWithFormattedVars.length));

  return parsed;
};

const fromTextConvertor =
  ({ buffer } = {}) =>
  ({ variables = [], cmsVariables } = {}) =>
  (next) =>
  (value, { cursor, entityMap, entityRanges, withoutTrim }) => {
    const matchedVariables = matchVariables(value, { withoutTrim });
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

      let entity = variablesIdMap[data.id] || variablesNameMap[data.name];
      let strEntity = entity ? `{${entity.name}}` : `{${data.name}}`;

      if (cmsVariables) {
        entity = buffer ? variablesNameMap[data.name] : variablesIdMap[data.id];
        strEntity = entity ? `{${entity.name}}` : `{${data.id}}`;
      }

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
