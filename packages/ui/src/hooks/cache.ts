import { Nullish } from '@voiceflow/common';
import React from 'react';

export const useCache = <T extends Record<string, any>>(defaultData: T, dataToUpdate: Partial<T> = defaultData): React.MutableRefObject<T> => {
  const cache = React.useRef(defaultData);

  Object.assign(cache.current, dataToUpdate);

  return cache;
};

export const useContextApi = <T>(api: T): T => React.useMemo(() => api, Object.values(api));

export const useCachedValue = <T>(value: T): React.MutableRefObject<T> => {
  const ref = React.useRef<T>(value);

  ref.current = value;

  return ref;
};

export const usePersistFunction = <T extends (...args: any[]) => any>(fn: Nullish<T>): T => {
  const fnRef = React.useRef<Nullish<T>>(fn);
  const persistFn = React.useRef<T>();

  fnRef.current = fn;

  if (!persistFn.current) {
    persistFn.current = ((...args: Parameters<T>) => fnRef.current?.(...args)) as T;
  }

  return persistFn.current;
};

export const useConst = <T>(value: T): T => {
  const ref = React.useRef<T>();

  if (ref.current === undefined) {
    ref.current = value;
  }

  return ref.current;
};

export const useCreateConst = <T>(creator: () => T): T => {
  const ref = React.useRef<T>();

  if (ref.current === undefined) {
    ref.current = creator();
  }

  return ref.current;
};
