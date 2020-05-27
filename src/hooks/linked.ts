import React from 'react';

import { noop } from '@/utils/functional';

/**
 * ref that is reset when the external value changes without side-effects
 */
export const useLinkedRef = <T>(externalValue: T) => {
  const value = React.useRef(externalValue);
  // separate from value to avoid being mutated externally
  const valueCache = React.useRef(externalValue);

  if (externalValue !== valueCache.current) {
    value.current = externalValue;

    valueCache.current = externalValue;
  }

  return value;
};

/**
 * local state value that is reset when the external value changes
 * without additional side-effects or state changes
 */
export const useLinkedState = <T>(externalValue: T): [T, (value: T) => void] => {
  const [stateValue, setState] = React.useState(externalValue);
  const cachedExternalValue = React.useRef(externalValue);
  const updateCache = React.useRef(noop);
  let currValue = stateValue;

  // override the local state value as long as the external value is fresher
  if (externalValue !== cachedExternalValue.current) {
    currValue = externalValue;
  }

  // ensure the latest externalValue is used, without re-memoizing updateValue()
  updateCache.current = () => {
    cachedExternalValue.current = externalValue;
  };

  const updateValue = React.useCallback((nextValue: T) => {
    // update cachedExternalValue to return to using local state
    updateCache.current();
    setState(nextValue);
  }, []);

  return [currValue, updateValue];
};
