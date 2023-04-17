import { Utils } from '@voiceflow/common';
import React from 'react';

export const useLazy = <T extends any[] | never[]>(
  callback: () => void,
  dependencies: T = [] as T,
  compareDependencies: (dependencies: T, prevDependencies: T) => boolean = Utils.array.hasIdenticalMembers
): ((dependencies: T) => void) => {
  const prevDependencies = React.useRef<T | null>(null);

  const setDependencies = React.useCallback((nextDependencies: T) => {
    prevDependencies.current = nextDependencies;
  }, []);

  const update = React.useCallback(() => {
    setDependencies(dependencies);
    callback();
  }, [callback]);

  // re-calculate values when dependencies change
  React.useMemo(() => {
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
