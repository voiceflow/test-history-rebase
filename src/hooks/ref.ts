import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export function useCombinedRefs<T>(...refs: (React.MutableRefObject<T | null> | ((value: T) => void) | null)[]) {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current!);
      } else {
        ref.current = targetRef.current!;
      }
    });
  }, [refs]);

  return targetRef;
}
