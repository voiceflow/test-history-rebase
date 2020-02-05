import React from 'react';

const LifecyclePhase = {
  MOUNTING: 'mounting',
  MOUNTED: 'mounted',
  UNMOUNTING: 'unmounting',
};

export const useLifecycle = () => {
  const phase = React.useRef(LifecyclePhase.MOUNTING);

  React.useEffect(() => {
    phase.current = LifecyclePhase.MOUNTED;

    return () => {
      phase.current = LifecyclePhase.UNMOUNTING;
    };
  }, []);

  return phase;
};

export const useSetup = (callback, dependencies = []) => {
  const phase = useLifecycle();
  // this must be determined outside of the useEffect()
  const isMounting = phase.current === LifecyclePhase.MOUNTING;
  const memoizedCallback = React.useCallback(callback, dependencies);

  React.useEffect(() => {
    if (isMounting) {
      // eslint-disable-next-line callback-return
      memoizedCallback();
    }
  }, [memoizedCallback, isMounting]);
};

export const useTeardown = (callback, dependencies = []) => {
  const phase = useLifecycle();
  const memoizedCallback = React.useCallback(callback, dependencies);

  React.useEffect(
    () => () => {
      // this must be determined inside of the useEffect()
      const isUnmounting = phase.current === LifecyclePhase.UNMOUNTING;

      if (isUnmounting) {
        // eslint-disable-next-line callback-return
        memoizedCallback();
      }
    },
    [memoizedCallback]
  );
};

export const useDidUpdateEffect = (callback, dependencies = []) => {
  const didMountRef = React.useRef(false);

  React.useEffect(() => {
    if (didMountRef.current) {
      // eslint-disable-next-line callback-return
      callback();
    } else {
      didMountRef.current = true;
    }
  }, dependencies);
};
