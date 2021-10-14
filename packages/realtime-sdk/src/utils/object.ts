export const getKeys = <T>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[];

export const hasProperty = <T, K extends keyof T>(obj: T, key: K | string): obj is T & Record<K, unknown> =>
  Object.prototype.hasOwnProperty.call(obj, key);
