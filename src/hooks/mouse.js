import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export function useMouseMove(onMouseMove, dependencies = []) {
  React.useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);

    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove, ...dependencies]);
}
