import React from 'react';

/**
 * ref that is reset when the external value changes without side-effects
 */
export const useLinkedRef = <T>(externalValue: T): React.MutableRefObject<T> => {
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
export const useLinkedState = <T>(externalValue: T, resetKey?: string): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [stateValue, setState] = React.useState(externalValue);
  const cache = React.useRef({
    resetKey,
    stateValue,
    currentValue: stateValue,
    externalValue,
  });

  // override the current value as long as value state value is changed
  if (stateValue !== cache.current.stateValue) {
    cache.current.currentValue = stateValue;
    cache.current.stateValue = stateValue;
  }

  // override the current state value as long as the external value or resetKey is fresher
  if (externalValue !== cache.current.externalValue || resetKey !== cache.current.resetKey) {
    cache.current.resetKey = resetKey;
    cache.current.currentValue = externalValue;
    cache.current.externalValue = externalValue;
  }

  return [cache.current.currentValue, setState];
};
