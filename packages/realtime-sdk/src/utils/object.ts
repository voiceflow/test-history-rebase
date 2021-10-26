export const getKeys = <T>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[];

export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> =>
  keys.reduce((acc, key) => Object.assign(acc, { [key]: obj[key] }), {} as Pick<T, K>);

export const hasProperty = <T, K extends keyof T>(obj: T, key: K | string): obj is T & Record<K, unknown> =>
  Object.prototype.hasOwnProperty.call(obj, key);
