import React from 'react';

export const useMemoizedPropertyFilter = <T extends Record<string, any>>(
  map: Array<T>,
  filter: Partial<T>,
  deps: unknown[]
): Array<T> =>
  React.useMemo(() => {
    const filterEntries = Object.entries(filter);

    return map.filter((item) => filterEntries.every(([key, value]) => item[key] === value));
  }, deps);
