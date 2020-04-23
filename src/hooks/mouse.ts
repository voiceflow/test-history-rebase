import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export function useMouseMove(onMouseMove: (event: MouseEvent) => void, dependencies: any[] = []) {
  React.useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);

    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove, ...dependencies]);
}
