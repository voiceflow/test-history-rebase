import React from 'react';

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
