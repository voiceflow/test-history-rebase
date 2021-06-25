import { useLayoutEffect, useRef } from 'react';

export { LifecyclePhase, useDidUpdateEffect, useLifecycle, useOnScreen, useSetup, useTeardown } from '@voiceflow/ui';

export const useLayoutDidUpdate = (callback: () => void, dependencies: any[] = []) => {
  const didMount = useRef(false);

  useLayoutEffect(() => {
    if (didMount.current) {
      // eslint-disable-next-line callback-return
      callback();
    } else {
      didMount.current = true;
    }
  }, dependencies);
};
