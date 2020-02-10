import { utils } from '@voiceflow/common';
import cloneDeep from 'lodash/cloneDeep';

import { encodeCustomAPIData } from '@/client/adapters/creator/block/integration';

const { deepDraftToMarkdown } = utils.intent;

export const normalize = (data) => {
  const dataCreatorAPIFormat = encodeCustomAPIData(data);

  // this is the format used on a rendered diagram on voiceflow-server
  return deepDraftToMarkdown(dataCreatorAPIFormat).result;
};

export const findPath = (path, data) => {
  const props = path.split('.');
  let cur_data = { response: data };
  props.forEach((prop) => {
    const props_and_inds = prop.split('[');
    props_and_inds.forEach((prop_or_ind) => {
      if (prop_or_ind.includes(']')) {
        const index_str = prop_or_ind.slice(0, -1);
        let index;
        if (index_str.toLowerCase() === '{random}') {
          index = Math.floor(Math.random() * cur_data.length);
        } else {
          index = parseInt(index_str, 10);
        }
        cur_data = cur_data[index];
      } else {
        cur_data = cur_data[prop_or_ind];
      }
    });
  });

  return cur_data;
};

/**
 * When passed in an object, find all instances of a variable being used
 * @param {Object} object
 * @returns {Array} all things matching a variable format in this object
 */
export const deepVariableSearch = (object) => {
  const variables = new Set();

  const recurse = (subCollection) => {
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

const replacer = (match, inner, variablesMap, uriEncode = false) => {
  if (inner in variablesMap) {
    return uriEncode ? encodeURI(variablesMap[inner]) : variablesMap[inner];
  }
  return match;
};

export const variableReplacement = (phrase, variables) => {
  if (!phrase || !phrase.trim()) {
    return '';
  }
  return phrase.replace(/{(\w*){1,16}}/g, (match, inner) => replacer(match, inner, variables));
};

export const deepVariableReplacement = (object, variableMap) => {
  const recurse = (subCollection, uriEncode = false) => {
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
