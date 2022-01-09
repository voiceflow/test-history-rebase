import React from 'react';

/**
 * TODO: recommend removing this and using @seznam/compose-react-refs instead
 * as this introduces an additional effect callback to propagate ref changes
 * which can lead to a render cycle where targetRef and the elements of refs
 * are out of date
 * @deprecated
 */
// eslint-disable-next-line import/prefer-default-export
export function useCombinedRefs<T>(...refs: (React.MutableRefObject<T | null> | ((value: T) => void) | null)[]) {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current!);
      } else {
        // eslint-disable-next-line no-param-reassign
        ref.current = targetRef.current!;
      }
    });
  }, [refs]);

  return targetRef;
}
