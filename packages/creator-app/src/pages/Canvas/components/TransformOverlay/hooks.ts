import { preventDefault } from '@voiceflow/ui';
import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useSwallowZoom = <T extends HTMLElement>() => {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const onWheel = preventDefault();

    ref.current?.addEventListener('wheel', onWheel, { passive: false });

    return () => ref.current?.removeEventListener('wheel', onWheel);
  }, []);

  return ref;
};
