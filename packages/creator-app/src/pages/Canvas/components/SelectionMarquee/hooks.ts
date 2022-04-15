import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';
import { SelectionMarqueeAPI } from '@/pages/Canvas/types';

import { styleSelectionElement } from './constants';

type InternalSelectionMarqueeAPI = SelectionMarqueeAPI & {
  ref: React.RefObject<HTMLDivElement>;
};

export const useSelectionMarqueeAPI = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const engine = React.useContext(EngineContext)!;

  return React.useMemo<InternalSelectionMarqueeAPI>(
    () => ({
      ref,
      show: () => {
        document.addEventListener(
          'mouseup',
          () => {
            const rootEl = ref.current!;

            engine.groupSelection.complete();

            window.requestAnimationFrame(() => {
              styleSelectionElement(rootEl, 0, 0, 0, 0);
            });
          },
          { once: true }
        );
      },
    }),
    []
  );
};
