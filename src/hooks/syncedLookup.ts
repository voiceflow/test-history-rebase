import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useSyncedLookup = <T extends any>(syncedKeys: string[], items: T[]) => {
  const prevLookup = React.useRef<Record<string, T>>({});

  const lookup = React.useMemo(() => {
    if (syncedKeys.length !== items.length) {
      return prevLookup.current;
    }

    return syncedKeys.reduce<Record<string, T>>((acc, key, index) => {
      acc[key] = items[index];
      return acc;
    }, {});
  }, [syncedKeys, items]);

  prevLookup.current = lookup;

  return lookup;
};
