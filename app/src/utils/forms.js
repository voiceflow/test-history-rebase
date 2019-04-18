import toPath from 'lodash/toPath';

export const getTransform = (obj, field) => {
  const path = toPath(field);

  let p = 0;

  while (obj && p < path.length) {
    if (typeof obj === 'object' && !Array.isArray(obj) && !Number.isNaN(+path[p])) {
      p++;
    } else {
      obj = obj[path[p++]];
    }

    if (typeof obj === 'function') {
      return obj;
    }
  }

  return null;
};

export const autoFocusCreator = errors => {
  let focused = false;

  return field => {
    if (!!errors[field] && !focused) {
      focused = true;
      return true;
    }

    return false;
  };
};
