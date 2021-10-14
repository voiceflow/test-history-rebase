import { Utils } from '@voiceflow/realtime-sdk';
import _cloneDeep from 'lodash/cloneDeep';
import _isObject from 'lodash/isObject';
import _toPath from 'lodash/toPath';
import _transform from 'lodash/transform';

export const { hasProperty, getKeys } = Utils.object;

export const getIn = (rawObj, key, def, index = 0) => {
  const path = _toPath(key);
  let obj = rawObj;
  let i = index;

  while (obj && i < path.length) {
    obj = obj[path[i++]];
  }

  return obj === undefined ? def : obj;
};

export const setIn = (obj, path, value) => {
  const res = {};
  const pathArray = _toPath(path);
  let resVal = res;
  let i = 0;

  for (; i < pathArray.length - 1; i++) {
    const currentPath = pathArray[i];
    const currentObj = getIn(obj, pathArray.slice(0, i + 1));

    if (resVal[currentPath]) {
      resVal = resVal[currentPath];
    } else if (currentObj) {
      resVal[currentPath] = _cloneDeep(currentObj);
      resVal = resVal[currentPath];
    } else {
      const nextPath = pathArray[i + 1];

      resVal[currentPath] = +nextPath >= 0 ? [] : {};
      resVal = resVal[currentPath];
    }
  }

  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj;
  }

  if (value === undefined) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  }

  const result = { ...obj, ...res };

  if (i === 0 && value === undefined) {
    delete result[pathArray[i]];
  }

  return result;
};

export const filterEntries = (obj, predicate) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (predicate(key, value)) {
      acc[key] = value;
    }

    return acc;
  }, {});

export const getDiff = (object, base) => {
  const changes = (object, base) =>
    _transform(object, (result, value, key) => {
      if (value !== base[key]) {
        result[key] = _isObject(value) && _isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });
  return changes(object, base);
};

export const getTopLevelDiff = (object, base) => {
  const changes = (object, base) =>
    _transform(object, (result, value, key) => {
      if (value !== base[key]) {
        result[key] = value;
      }
    });
  return changes(object, base);
};
