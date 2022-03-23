import { useCachedValue } from '@voiceflow/ui';
import { useCallback, useMemo, useState } from 'react';

import { withTargetValue } from '@/utils/dom';

import { useLinkedRef, useLinkedState } from './linked';

export const useConstant = <T>(factory: () => T) => useMemo(factory, []);

export const useBufferedValue = <T>(
  externalValue: T,
  updateValue: (value: NonNullable<T>) => void,
  dependencies: any[] = []
): [value: T, setValue: (value: T) => void, saveValue: VoidFunction] => {
  const [value, setValue] = useLinkedState(externalValue);
  const valueCache = useCachedValue(value);

  const saveValue = useCallback(() => {
    updateValue(valueCache.current!);
  }, dependencies);

  return [value, setValue, saveValue];
};

export const useInputValue = (
  externalValue: string,
  updateValue: (value: string) => void,
  dependencies: any[] = []
): [value: string, setValue: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>, saveValue: VoidFunction] => {
  const [value, setValue, saveValue] = useBufferedValue(externalValue, updateValue, dependencies);

  const handleChange = useCallback(withTargetValue(setValue), [setValue]);

  return [value, handleChange, saveValue];
};

/**
 * useful when you want to be able to update a state value both mutably and immutably
 * use the ref when you need to make changes without triggering a render or incurring a hook dependency
 * invoke the update callback when you want to force a re-render
 */
export const useStatefulRef = <T>(initialValue: T): [React.MutableRefObject<T>, (value: T) => void] => {
  const [value, setValue] = useState(initialValue);
  const valueCache = useLinkedRef(value);

  return [valueCache, setValue];
};
