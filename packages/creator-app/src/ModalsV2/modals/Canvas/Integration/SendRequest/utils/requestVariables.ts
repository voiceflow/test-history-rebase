import cloneDeep from 'lodash/cloneDeep';

import { deepDraftToMarkdown } from '@/pages/Canvas/managers/Integration/components/ZapierAndGoogleEditor/components/utils';
import { encodeCustomAPIData } from '@/utils/integration';

export const normalize = (data: any) => {
  const dataCreatorAPIFormat = encodeCustomAPIData(data);

  // this is the format used on a rendered diagram on voiceflow-server
  return deepDraftToMarkdown(dataCreatorAPIFormat).result;
};

/**
 * When passed in an object, find all instances of a variable being used
 * @param {Object} object
 * @returns {Array} all things matching a variable format in this object
 */
export const deepVariableSearch = (object: any) => {
  const variables = new Set();

  const recurse = (subCollection: any) => {
    if (typeof subCollection === 'object') {
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const key in subCollection) {
        recurse(subCollection[key]);
      }
    } else if (typeof subCollection === 'string') {
      const re = /{(\w*){1,16}}/g;
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

const replacer = (match: any, inner: any, variablesMap: any, uriEncode = false) => {
  if (inner in variablesMap) {
    return uriEncode ? encodeURI(decodeURI(variablesMap[inner])) : variablesMap[inner];
  }
  return match;
};

export const deepVariableReplacement = (object: any, variableMap: any) => {
  const recurse = (subCollection: any, uriEncode = false) => {
    if (typeof subCollection === 'object') {
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const key in subCollection) {
        subCollection[key] = key === 'url' ? recurse(subCollection[key], true) : recurse(subCollection[key]);
      }
    } else if (typeof subCollection === 'string') {
      return subCollection.replace(/{(\w*){1,16}}/g, (match, inner) => replacer(match, inner, variableMap, uriEncode));
    }
    return subCollection;
  };

  return recurse(cloneDeep(object));
};
