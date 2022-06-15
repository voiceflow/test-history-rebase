import React from 'react';

export function useMouseMove(onMouseMove: (event: MouseEvent) => void, dependencies: any[] = []) {
  React.useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);

    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove, ...dependencies]);
}

export const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void, deps: any[] = []): void => {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!event.target) return;

      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('click', listener, true);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('click', listener, true);
      document.removeEventListener('touchstart', listener);
    };
  }, [...deps, ref, handler]);
};
