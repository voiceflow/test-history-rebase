import React from 'react';

export const useCache = <T extends Record<string, unknown>>(defaultData: T, dataToUpdate: Partial<T> = defaultData): React.MutableRefObject<T> => {
  const cache = React.useRef(defaultData);

  Object.assign(cache.current, dataToUpdate);

  return cache;
};

export const useContextApi = <T extends Record<string, unknown>>(api: T): T => React.useMemo(() => api, Object.values(api));
