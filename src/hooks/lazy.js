import React from 'react';

import { hasIdenticalMembers } from '@/utils/array';

// eslint-disable-next-line import/prefer-default-export
export const useLazy = (callback, dependencies = [], compareDependencies = hasIdenticalMembers) => {
  const prevDependencies = React.useRef(null);

  const setDependencies = React.useCallback((nextDependencies) => {
    prevDependencies.current = nextDependencies;
  }, []);

  const update = React.useCallback(() => {
    setDependencies(dependencies);
    // eslint-disable-next-line callback-return
    callback();
  }, [callback]);

  // re-calculate values when dependencies change
  React.useEffect(() => {
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
