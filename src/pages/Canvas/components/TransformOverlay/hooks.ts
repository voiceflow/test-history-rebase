import moize from 'moize';
import React from 'react';

import { preventDefault } from '@/utils/dom';

export const useCurried = <T extends (...args: any[]) => (...args: any[]) => void>(callback: T, deps: any[] = []): T =>
  React.useMemo(() => moize(callback), deps);

export const useSwallowZoom = <T extends HTMLElement>() => {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const onWheel = preventDefault();

    ref.current?.addEventListener('wheel', onWheel, { passive: false });

    return () => ref.current?.removeEventListener('wheel', onWheel);
  }, []);

  return ref;
};
