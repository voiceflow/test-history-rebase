import { preventDefault, stopPropagation } from '@ui/utils';
import { Utils } from '@voiceflow/common';
import React from 'react';

import { usePersistFunction } from './cache';

export function useMouseMove(onMouseMove: (event: MouseEvent) => void, dependencies: any[] = []) {
  React.useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);

    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove, ...dependencies]);
}

export const useOnClickOutside = (
  refs: React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  deps: any[] = []
): void => {
  const clickRefs = Utils.array.toArray(refs);

  const persistedHandler = usePersistFunction(handler);

  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!event.target) return;

      let clickInRef = false;

      clickRefs.forEach((ref) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          clickInRef = true;
        }
      });

      if (clickInRef) return;

      persistedHandler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('click', listener, true);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('click', listener, true);
      document.removeEventListener('touchstart', listener);
    };
  }, [...deps, ...clickRefs]);
};

export const useDragTrap = () => {
  return {
    draggable: true,
    onClick: stopPropagation(),
    onMouseMove: stopPropagation(),
    onMouseDown: stopPropagation(),
    onMouseUp: stopPropagation(),
    onDragStart: stopPropagation(preventDefault(), true),
  };
};
