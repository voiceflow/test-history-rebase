import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useFocusWithin = (initialFocused = false) => {
  const focusRef = React.useRef<boolean>(initialFocused);

  const onFocus = React.useCallback(() => {
    focusRef.current = true;
  }, []);

  const onBlur = React.useCallback(() => {
    focusRef.current = false;
  }, []);

  return [focusRef, onFocus, onBlur];
};
