import { useMemo } from 'react';

export const useObjectsDiffsCount = (objectA: Record<string, any>, objectB: Record<string, any>) =>
  useMemo(() => Object.entries(objectA).filter(([k, v]) => objectB[k] !== v).length, [objectA, objectB]);
