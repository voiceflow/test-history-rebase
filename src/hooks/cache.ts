import { useRef } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useCache = <T extends Record<string, unknown>>(defaultData: T, dataToUpdate: Partial<T> = defaultData) => {
  const cache = useRef(defaultData);

  Object.assign(cache.current, dataToUpdate);

  return cache;
};
