import { withoutValue } from '@/utils/array';
import { stringify } from '@/utils/functional';

export type ObjectWithId = { id: number | string };

export type Normalized<T> = {
  byKey: Record<string, T>;
  allKeys: string[];
};

export const EMPTY: Normalized<any> = { byKey: {}, allKeys: [] };

export type NormalizedValue<T> = T extends Normalized<infer R> ? R : never;

export type GetKey<T> = (obj: T, index?: number, array?: T[]) => string;

export const defaultGetKey = <T extends ObjectWithId>(obj: T) => stringify(obj.id);

export const safeAdd = <T>(items: T[], obj: T) => (items.includes(obj) ? items : [...items, obj]);

export const safeAddToStart = <T>(items: T[], obj: T) => (items.includes(obj) ? items : [obj, ...items]);

export const getByIndex = <T>(items: T[]) => (_: string, index: number): T => items[index];

export const getByKey = <T>(lookup: Record<string, T>) => (key: string) => lookup[key];

export const buildLookup = <T>(allKeys: string[], getValue: (key: string, index: number) => T) =>
  allKeys.reduce<Record<string, T>>((acc, key, index) => {
    acc[key] = getValue(key, index);

    return acc;
  }, {});

export const normalize = <T extends ObjectWithId | unknown, K extends GetKey<T> = (obj: T) => string>(items: T[], getKey?: K) => {
  const allKeys = items.map(getKey ?? ((defaultGetKey as unknown) as K));

  return {
    allKeys,
    byKey: buildLookup<T>(allKeys, getByIndex<T>(items)),
  };
};

export const denormalize = <T>({ allKeys, byKey }: Normalized<T>) => allKeys.map((key) => byKey[key]);

export const getNormalizedByKey = <T>({ byKey }: Normalized<T>, key: string) => byKey[key];

export const getAllNormalizedByKeys = <T>({ byKey }: Normalized<T>, keys: string[]) => keys.map((key) => byKey[key]);

export const updateNormalizedByKey = <T, N extends Normalized<T>>({ byKey, ...rest }: N, key: string, obj: T) =>
  ({
    ...rest,
    byKey: { ...byKey, [key]: obj },
  } as N);

export const patchNormalizedByKey = <T, N extends Normalized<T>>(normalized: N, key: string, obj: Partial<T>) =>
  updateNormalizedByKey(normalized, key, { ...getNormalizedByKey(normalized, key), ...obj });

export const addNormalizedByKey = <T>(normalized: Normalized<T>, key: string, obj: T) => ({
  ...updateNormalizedByKey(normalized, key, obj),
  allKeys: safeAdd(normalized.allKeys, key),
});

export const addToStartNormalizedByKey = <T>(normalized: Normalized<T>, key: string, obj: T) => ({
  ...updateNormalizedByKey(normalized, key, obj),
  allKeys: safeAddToStart(normalized.allKeys, key),
});

export const addAllNormalizedByKeys = <T extends ObjectWithId | unknown, K extends GetKey<T> = (obj: T) => string>(
  normalized: Normalized<T>,
  objs: T[],
  getKey?: K
): Normalized<T> => {
  const keyGetter = getKey ?? ((defaultGetKey as unknown) as K);
  const keys = objs.map(keyGetter);

  return {
    byKey: {
      ...normalized.byKey,
      ...objs.reduce<Record<string, T>>((acc, obj) => Object.assign(acc, { [keyGetter(obj)]: obj }), {}),
    },
    allKeys: keys.reduce(safeAdd, normalized.allKeys),
  };
};

export const removeNormalizedByKey = <T>({ allKeys, byKey }: Normalized<T>, targetKey: string): Normalized<T> => {
  const filteredKeys = withoutValue(allKeys, targetKey);

  return {
    allKeys: filteredKeys,
    byKey: buildLookup(filteredKeys, getByKey(byKey)),
  };
};

export const reorderKeys = <T>(newKeyArray: string[], byKey: Record<string, T>): Normalized<T> => {
  return {
    allKeys: newKeyArray,
    byKey,
  };
};

export const removeAllNormalizedByKeys = <T>({ allKeys, byKey }: Normalized<T>, targetKeys: string[]): Normalized<T> => {
  const filteredKeys = allKeys.filter((key) => !targetKeys.includes(key));

  return {
    allKeys: filteredKeys,
    byKey: buildLookup(filteredKeys, getByKey(byKey)),
  };
};
