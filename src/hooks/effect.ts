import { useEffect, useRef } from 'react';

import { noop } from '@/utils/functional';

import { useTeardown } from './lifecycle';

export const useAsyncMountUnmount = (didMount: () => void, willUnmount: () => void) => {
  useEffect(() => {
    didMount();

    if (willUnmount) {
      return willUnmount;
    }

    return undefined;
  }, []);
};

export const useOneTimeEffect = (effect: () => boolean, dependencies: any[] = []) => {
  const wasTriggered = useRef(false);

  useEffect(() => {
    if (!wasTriggered.current) {
      wasTriggered.current = effect();
    }
  }, dependencies);
};

// eslint-disable-next-line import/prefer-default-export
export const useRegistration = (register: () => () => void, dependencies: any[] = []) => {
  const teardownRef = useRef(noop);

  useEffect(() => {
    teardownRef.current = register();
  }, dependencies);

  useTeardown(() => teardownRef.current());
};
