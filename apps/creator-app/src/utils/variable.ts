import { READABLE_VARIABLE_REGEXP, Utils } from '@voiceflow/common';
import cloneDeep from 'lodash/cloneDeep';

/**
 * When passed in an object, find all instances of a variable being used
 * @param {Object} object
 * @returns {Array} all things matching a variable format in this object
 */
export const deepVariableSearch = <T extends object>(object: T, regex = READABLE_VARIABLE_REGEXP): string[] => {
  const variables = new Set<string>();

  const recurse = (subCollection: unknown) => {
    if (Utils.object.isObject(subCollection)) {
      // eslint-disable-next-line guard-for-in
      for (const key in subCollection) {
        recurse(subCollection[key]);
      }
    } else if (typeof subCollection === 'string') {
      const re = new RegExp(regex);

      let m;
      // eslint-disable-next-line no-cond-assign
      while ((m = re.exec(subCollection))) {
        variables.add(m[1]);
      }
    }
    return subCollection;
  };

  recurse(object);

  return [...variables];
};

const variableReplacer = (match: string, inner: string, variablesMap: Record<string, unknown>, uriEncode = false): string => {
  if (inner in variablesMap) {
    const value = String(variablesMap[inner]);

    return uriEncode && typeof value === 'string' ? encodeURI(decodeURI(value)) : value;
  }

  return match;
};

export const deepVariableReplacement = <T extends object>(object: T, variableMap: Record<string, unknown>, regex = READABLE_VARIABLE_REGEXP): T => {
  const recurse = (subCollection: unknown, uriEncode = false) => {
    if (Utils.object.isObject(subCollection)) {
      // eslint-disable-next-line guard-for-in
      for (const key in subCollection) {
        subCollection[key] = key === 'url' ? recurse(subCollection[key], true) : recurse(subCollection[key]);
      }
    } else if (typeof subCollection === 'string') {
      return subCollection.replace(regex, (match, inner: string) => variableReplacer(match, inner, variableMap, uriEncode));
    }
    return subCollection;
  };

  return recurse(cloneDeep(object)) as T;
};
