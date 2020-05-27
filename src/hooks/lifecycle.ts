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

export const useSetup = (callback: () => void, dependencies: any[] = []) => {
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

export const useTeardown = (callback: () => void, dependencies: any[] = []) => {
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

export const useDidUpdateEffect = (callback: () => void, dependencies: any[] = []) => {
  const didMount = React.useRef(false);

  React.useEffect(() => {
    if (didMount.current) {
      // eslint-disable-next-line callback-return
      callback();
    } else {
      didMount.current = true;
    }
  }, dependencies);
};
