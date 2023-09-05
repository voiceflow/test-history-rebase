import { useDeferredValue, useRef, useState } from 'react';

export const useDeferredState = <T>(initialValue: T) => {
  const [value, setValue] = useState(initialValue);

  const deferredValue = useDeferredValue(value);

  return [value, deferredValue, setValue] as const;
};

/**
 * useful for setting state value from props when useLinkedState can't be used
 */
export const useSetValueOnChange = <ExternalValue>(value: ExternalValue, setValue: (value: ExternalValue) => void) => {
  const prevValueRef = useRef(value);

  if (prevValueRef.current !== value) {
    prevValueRef.current = value;
    setValue(value);
  }
};

interface ILinkedState {
  <ExternalValue>(externalValue: ExternalValue): [ExternalValue, React.Dispatch<React.SetStateAction<ExternalValue>>];
  <ExternalValue, InternalValue>(externalValue: ExternalValue, transform: (value: ExternalValue) => InternalValue): [
    InternalValue,
    React.Dispatch<React.SetStateAction<InternalValue>>
  ];
}

/**
 * local state value that is reset when the external value changes
 */
export const useLinkedState: ILinkedState = (
  externalValue: unknown,
  transform: (value: unknown) => unknown = (value) => value
): [unknown, React.Dispatch<React.SetStateAction<unknown>>] => {
  const [value, setValue] = useState(() => transform(externalValue));

  useSetValueOnChange(externalValue, (value) => setValue(transform(value)));

  return [value, setValue];
};
