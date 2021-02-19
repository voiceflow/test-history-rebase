/* eslint-disable no-case-declarations */
import { IS_TEST } from '@/config';

let lastKey = new Date().getTime();
const globalCache = new Map();

function getKey(object: any, cache: Map<any, string>) {
  if (IS_TEST) {
    const key = cache.get(object) || `test-key-${cache.size}`;

    cache.set(object, key);

    return key;
  }

  switch (typeof object) {
    case 'object':
    case 'function':
      const currentKey = cache.get(object);
      if (currentKey) {
        return currentKey;
      }
      lastKey++;
      const newKey = `${lastKey}`;
      cache.set(object, newKey);
      return newKey;
    case 'symbol':
      return object.toString();
    default:
      return `${object}`;
  }
}

export const generateKey = (object: any) => getKey(object, globalCache);

export function generateLocalKey() {
  const cache = new Map();

  return (object: any) => getKey(object, cache);
}
