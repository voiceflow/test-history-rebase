import { useEffect, useRef } from 'react';

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
