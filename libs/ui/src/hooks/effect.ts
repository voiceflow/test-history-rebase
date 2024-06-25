import type { Callback } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { useEffect, useRef } from 'react';

import { useDidUpdateEffect, useTeardown } from './lifecycle';

export const useAsyncEffect = (effect: () => Promise<void>, dependencies: unknown[] = []): void =>
  useEffect(() => {
    effect();
  }, dependencies);

export const useAsyncDidUpdate = (effect: () => Promise<void>, dependencies: unknown[] = []): void =>
  useDidUpdateEffect(() => {
    effect();
  }, dependencies);

export const useAsyncMountUnmount = (didMount?: () => void, willUnmount?: () => void): void => {
  useEffect(() => {
    didMount?.();

    if (willUnmount) {
      return willUnmount;
    }

    return undefined;
  }, []);
};

export const useOneTimeEffect = (effect: () => boolean, dependencies: unknown[] = []): void => {
  const wasTriggered = useRef(false);

  useEffect(() => {
    if (!wasTriggered.current) {
      wasTriggered.current = effect();
    }
  }, dependencies);
};

export const useRegistration = (register: () => () => void, dependencies: unknown[] = []): void => {
  const teardownRef = useRef(Utils.functional.noop);

  useEffect(() => {
    teardownRef.current = register();
  }, dependencies);

  useTeardown(() => teardownRef.current());
};

export const useInterval = (callback: Callback, timeout: number, dependencies: unknown[] = []): void =>
  useEffect(() => {
    const interval = setInterval(callback, timeout);

    return () => clearInterval(interval);
  }, dependencies);

export const useTimeout = (callback: Callback, timeout: number, dependencies: unknown[] = []): void =>
  useEffect(() => {
    const timer = setTimeout(callback, timeout);

    return () => clearTimeout(timer);
  }, dependencies);
