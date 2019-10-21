import { withoutValue } from '@/utils/array';

export const defaultGetKey = (obj) => obj.id;

export const safeAdd = (items, obj) => (items.includes(obj) ? items : [...items, obj]);

export const getByIndex = (items) => (_, index) => items[index];

export const getByKey = (lookup) => (key) => lookup[key];

export const buildLookup = (allKeys, getValue) =>
  allKeys.reduce((acc, key, index) => {
    acc[key] = getValue(key, index);

    return acc;
  }, {});

export const normalize = (items, getKey = defaultGetKey) => {
  const allKeys = items.map(getKey);

  return {
    allKeys,
    byKey: buildLookup(allKeys, getByIndex(items)),
  };
};

export const denormalize = ({ allKeys, byKey }) => allKeys.map((key) => byKey[key]);

export const getNormalizedByKey = ({ byKey }, key) => byKey[key];

export const getAllNormalizedByKeys = ({ byKey }, keys) => keys.map((key) => byKey[key]);

export const updateNormalizedByKey = ({ allKeys, byKey }, key, obj) => ({
  allKeys,
  byKey: { ...byKey, [key]: obj },
});

export const patchNormalizedByKey = (normalized, key, obj) =>
  updateNormalizedByKey(normalized, key, { ...getNormalizedByKey(normalized, key), ...obj });

export const addNormalizedByKey = (normalized, key, obj) => ({
  ...updateNormalizedByKey(normalized, key, obj),
  allKeys: safeAdd(normalized.allKeys, key),
});

export const addAllNormalizedByKeys = (normalized, objs, getKey = defaultGetKey) => {
  const keys = objs.map(getKey);

  return {
    byKey: {
      ...normalized.byKey,
      ...objs.reduce((acc, obj) => {
        acc[getKey(obj)] = obj;

        return acc;
      }, {}),
    },
    allKeys: keys.reduce(safeAdd, normalized.allKeys),
  };
};

export const removeNormalizedByKey = ({ allKeys, byKey }, targetKey) => {
  const filteredKeys = withoutValue(allKeys, targetKey);

  return {
    allKeys: filteredKeys,
    byKey: buildLookup(filteredKeys, getByKey(byKey)),
  };
};

export const removeAllNormalizedByKeys = ({ allKeys, byKey }, targetKeys) => {
  const filteredKeys = allKeys.filter((key) => !targetKeys.includes(key));

  return {
    allKeys: filteredKeys,
    byKey: buildLookup(filteredKeys, getByKey(byKey)),
  };
};
