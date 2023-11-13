/* eslint-disable sonarjs/cognitive-complexity */
import { RefUtil, useCreateConst, usePersistFunction } from '@voiceflow/ui-next';
import { useEffect, useRef, useState } from 'react';

import { useLinkedState } from './state.hook';

export const useInputFocus = (initialValue = false) => {
  const [active, setActive] = useState(initialValue);

  const onBlur = usePersistFunction(() => setActive(false));
  const onFocus = usePersistFunction(() => setActive(true));

  return {
    active,
    attributes: {
      onBlur,
      onFocus,
    },
  };
};

interface InputAPI<Value, Element> {
  ref: React.RefObject<Element>;
  value: Value;
  error: string | undefined;
  empty: boolean;
  focused: boolean;
  setValue: (value: Value) => void;

  attributes: {
    ref: React.Ref<Element>;
    value: Value;
    onBlur: VoidFunction;
    onFocus: VoidFunction;
    autoFocus: boolean;
    onValueChange: (value: Value) => void;
  };
}

interface BaseInputProps<Value, Element> {
  ref?: React.Ref<Element>;
  value: Value;
  error?: string | null | false;
  onBlur?: VoidFunction;
  onEmpty?: (isEmpty: boolean) => void;
  onFocus?: VoidFunction;
  autoFocus?: boolean;
  allowEmpty?: boolean;
  autoFocusIfEmpty?: boolean;

  /**
   * if true - onSave will be called on unmount, should be static value
   * @default true
   */
  saveOnUnmount?: boolean;
}

interface SimpleInputProps<ExternalValue, Element> extends BaseInputProps<ExternalValue, Element> {
  onSave: (value: ExternalValue) => void;
  isEmpty?: (value: ExternalValue) => boolean;
}

interface TransformInputProps<ExternalValue, InternalValue, Element> extends BaseInputProps<ExternalValue, Element> {
  onSave: (value: InternalValue) => void;
  isEmpty?: (value: InternalValue) => boolean;
  transform: (value: ExternalValue) => InternalValue;
}

interface IInput {
  <ExternalValue, Element extends { focus: VoidFunction } = HTMLInputElement>(props: SimpleInputProps<ExternalValue, Element>): InputAPI<
    ExternalValue,
    Element
  >;
  <ExternalValue, InternalValue, Element extends { focus: VoidFunction } = HTMLInputElement>(
    props: TransformInputProps<ExternalValue, InternalValue, Element>
  ): InputAPI<InternalValue, Element>;
}

export const useInput: IInput = ({
  ref: propRef,
  value: propValue,
  error,
  onSave,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  onEmpty,
  isEmpty = (value) => !value,
  transform = (value) => value,
  autoFocus: autoFocusProp = false,
  allowEmpty = true,
  saveOnUnmount = true,
  autoFocusIfEmpty: autoFocusIfEmptyProp = false,
}: SimpleInputProps<any, any> & { transform?: (value: unknown) => unknown }) => {
  const ref = useRef<{ focus: VoidFunction }>(null);
  const focus = useInputFocus();
  const changedRef = useRef(false);

  const [value, setValue] = useLinkedState(propValue, transform);
  const [empty, setEmpty] = useState(() => isEmpty(value));

  const onChange = usePersistFunction((newValue: unknown) => {
    changedRef.current = value !== newValue;
    setValue(newValue);

    if (!onEmpty) return;

    const nextEmpty = isEmpty(value);

    if (empty !== nextEmpty) {
      setEmpty(nextEmpty);
      onEmpty(nextEmpty);
    }
  });

  const onFocus = usePersistFunction(() => {
    focus.attributes.onFocus();
    onFocusProp?.();
  });

  const onBlur = usePersistFunction(() => {
    focus.attributes.onBlur();
    onBlurProp?.();

    if (!changedRef.current) return;

    changedRef.current = false;

    if (!allowEmpty && isEmpty(value)) {
      onChange(propValue);
      return;
    }

    onSave(value);
  });

  const autoFocusIfEmpty = useCreateConst(() => autoFocusIfEmptyProp && empty);
  const autoFocus = autoFocusProp || autoFocusIfEmpty;

  useEffect(() => {
    if (!autoFocus) return undefined;

    const frame = requestAnimationFrame(() => ref.current?.focus());

    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);

  useEffect(
    () => () => {
      if (!saveOnUnmount) return;

      onBlur();
    },
    []
  );

  return {
    ref,
    error: !focus.active && error ? error : undefined,
    value,
    empty,
    focused: focus.active,
    setValue: onChange,

    attributes: {
      ref: RefUtil.composeRefs(ref, propRef),
      value,
      onBlur,
      onFocus,
      autoFocus,
      onValueChange: onChange,
    },
  };
};

interface IUseInputStateWithError {
  <Value>(value: Value): readonly [value: Value, error: string | null, setValue: (value: Value) => void, setError: (value: string | null) => void];
  <Value, Error>(value: Value, error: Error | null): readonly [
    value: Value,
    error: Error | null,
    setValue: (value: Value) => void,
    setError: (value: Error | null) => void
  ];
}

/**
 * resets error on value change
 */
export const useInputStateWithError: IUseInputStateWithError = (propValue: unknown, propError: unknown = null) => {
  const [value, setValue] = useLinkedState(propValue);
  const [error, setError] = useLinkedState<any>(propError);

  const onValueChange = usePersistFunction((newValue: unknown) => {
    setError(null);
    setValue(newValue);
  });

  return [value, error, onValueChange, setError] as const;
};

/**
 * cleans autoFocusKey on next render to don't focus on the same input twice
 */
export const useInputAutoFocusKey = (): readonly [autoFocusKey: string, setAutoFocusKey: React.Dispatch<React.SetStateAction<string>>] => {
  const [autoFocusKey, setAutoFocusKey] = useState('');

  useEffect(() => {
    if (!autoFocusKey) return undefined;

    const frame = requestAnimationFrame(() => setAutoFocusKey(''));

    return () => cancelAnimationFrame(frame);
  }, [autoFocusKey]);

  return [autoFocusKey, setAutoFocusKey] as const;
};
