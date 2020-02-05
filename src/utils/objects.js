import _ from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import toPath from 'lodash/toPath';

export const getIn = (rawObj, key, def, index = 0) => {
  const path = toPath(key);
  let obj = rawObj;
  let i = index;

  while (obj && i < path.length) {
    obj = obj[path[i++]];
  }

  return obj === undefined ? def : obj;
};

export const setIn = (obj, path, value) => {
  const res = {};
  const pathArray = toPath(path);
  let resVal = res;
  let i = 0;

  for (; i < pathArray.length - 1; i++) {
    const currentPath = pathArray[i];
    const currentObj = getIn(obj, pathArray.slice(0, i + 1));

    if (resVal[currentPath]) {
      resVal = resVal[currentPath];
    } else if (currentObj) {
      resVal[currentPath] = cloneDeep(currentObj);
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
  function changes(object, base) {
    return _.transform(object, function(result, value, key) {
      if (value !== base[key]) {
        result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
};

export const getTopLevelDiff = (object, base) => {
  const changes = (object, base) =>
    _.transform(object, (result, value, key) => {
      if (value !== base[key]) {
        result[key] = value;
      }
    });
  return changes(object, base);
};
