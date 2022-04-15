import React from 'react';

import { EntityInstance } from './entity';

export const useElementInstance = <T extends HTMLElement | SVGElement>(ref: React.RefObject<T>) =>
  React.useMemo<EntityInstance>(
    () => ({
      isReady: () => !!ref.current,

      addClass: (className) => ref.current?.classList.add(className),
      removeClass: (className) => ref.current?.classList.remove(className),
    }),
    []
  );
