import { useCachedValue } from '@voiceflow/ui';
import { useCallback, useMemo, useRef, useState } from 'react';

import { hasIdenticalMembers } from '@/utils/array';

export const useLazy = <T extends any[] | never[]>(
  callback: () => void,
  dependencies: T = [] as T,
  compareDependencies: (dependencies: T, prevDependencies: T) => boolean = hasIdenticalMembers
): ((dependencies: T) => void) => {
  const prevDependencies = useRef<T | null>(null);

  const setDependencies = useCallback((nextDependencies: T) => {
    prevDependencies.current = nextDependencies;
  }, []);

  const update = useCallback(() => {
    setDependencies(dependencies);
    callback();
  }, [callback]);

  // re-calculate values when dependencies change
  useMemo(() => {
    if (prevDependencies.current === null || !compareDependencies(dependencies, prevDependencies.current)) {
      update();
    }
  }, dependencies);

  // initial calculation
  if (prevDependencies.current === null) {
    update();
  }

  return setDependencies;
};

export const useLazyState = <T>(initialValue: T): [() => T, (value: T) => void] => {
  const [value, setValue] = useState(initialValue);
  const valueRef = useCachedValue(value);

  const getValue = useCallback(() => valueRef.current, []);

  return [getValue, setValue];
};
