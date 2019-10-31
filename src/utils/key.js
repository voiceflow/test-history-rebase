/* eslint-disable no-case-declarations */
/* eslint-disable compat/compat */
let lastKey = new Date().getTime();
const globalCache = new Map();

function getKey(object, cache) {
  if (process.env.NODE_ENV === 'test') {
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

export function generateKey(object) {
  return getKey(object, globalCache);
}

export function generateLocalKey() {
  const cache = new Map();
  return (object) => {
    return getKey(object, cache);
  };
}
