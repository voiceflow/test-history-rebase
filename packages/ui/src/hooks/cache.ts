import React from 'react';

export const useCache = <T extends Record<string, unknown>>(defaultData: T, dataToUpdate: Partial<T> = defaultData): React.MutableRefObject<T> => {
  const cache = React.useRef(defaultData);

  Object.assign(cache.current, dataToUpdate);

  return cache;
};

export const useContextApi = <T>(api: T): T => React.useMemo(() => api, Object.values(api));

export const usePersistFunction = <T extends (...args: any[]) => any>(fn: T | undefined): T => {
  const fnRef = React.useRef<T | undefined>(fn);
  const persistFn = React.useRef<T>();

  fnRef.current = fn;

  if (!persistFn.current) {
    persistFn.current = ((...args: Parameters<T>) => fnRef.current?.(...args)) as T;
  }

  return persistFn.current;
};
