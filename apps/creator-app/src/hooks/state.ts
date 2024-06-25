import { useCachedValue, useLinkedRef, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import { withTargetValue } from '@/utils/dom';

export const useBufferedValue = <T>(
  externalValue: T,
  updateValue: (value: NonNullable<T>) => void,
  dependencies: any[] = []
): [value: T, setValue: (value: T) => void, saveValue: VoidFunction] => {
  const [value, setValue] = useLinkedState(externalValue);
  const valueCache = useCachedValue(value);

  const saveValue = React.useCallback(() => {
    updateValue(valueCache.current!);
  }, dependencies);

  return [value, setValue, saveValue];
};

export const useInputValue = (
  externalValue: string,
  updateValue: (value: string) => void,
  dependencies: any[] = []
): [
  value: string,
  setValue: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  saveValue: VoidFunction,
] => {
  const [value, setValue, saveValue] = useBufferedValue(externalValue, updateValue, dependencies);

  const handleChange = React.useCallback(withTargetValue(setValue), [setValue]);

  return [value, handleChange, saveValue];
};

/**
 * useful when you want to be able to update a state value both mutably and immutably
 * use the ref when you need to make changes without triggering a render or incurring a hook dependency
 * invoke the update callback when you want to force a re-render
 */
export const useStatefulRef = <T>(initialValue: T): [React.MutableRefObject<T>, (value: T) => void] => {
  const [value, setValue] = React.useState(initialValue);
  const valueCache = useLinkedRef(value);

  return [valueCache, setValue];
};

export const usePreviousValue = <T>(value: T): T | null => {
  const previousRef = React.useRef<T | null>(null);

  React.useEffect(
    () => () => {
      previousRef.current = value;
    },
    [value]
  );

  return previousRef.current;
};
