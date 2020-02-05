import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import toPath from 'lodash/toPath';

export const getTransform = (rawObj, field) => {
  const path = toPath(field);
  let p = 0;
  let obj = rawObj;

  while (obj && p < path.length) {
    if (isObject(obj) && !Array.isArray(obj) && !Number.isNaN(+path[p])) {
      p++;
    } else {
      obj = obj[path[p++]];
    }

    if (isFunction(obj)) {
      return obj;
    }
  }

  return null;
};

export const autoFocusCreator = (errors) => {
  let focused = false;

  return (field) => {
    if (!!errors[field] && !focused) {
      focused = true;
      return true;
    }

    return false;
  };
};
