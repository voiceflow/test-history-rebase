import { useCreateConst, usePersistFunction, useTeardown } from '@voiceflow/ui';
import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useResizeObserver = (ref: React.RefObject<HTMLElement>, onResize: (entries: ResizeObserverEntry[]) => void): void => {
  const onPersistedResize = usePersistFunction(onResize);
  const observer = useCreateConst(() => new ResizeObserver((entries) => onPersistedResize(entries)));

  React.useEffect(() => {
    if (ref.current) {
      const node = ref.current;

      observer.observe(node);

      return () => {
        observer.unobserve(node);
      };
    }

    return undefined;
  }, [ref.current]);

  useTeardown(() => observer.disconnect());
};
