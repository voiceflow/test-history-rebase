/* eslint-disable sonarjs/cognitive-complexity */
import { RefUtil, useCreateConst, useExternalID, usePersistFunction } from '@voiceflow/ui-next';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

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

export interface InputAPI<Value, Element> {
  id: string;
  ref: React.RefObject<Element>;
  value: Value;
  empty: boolean;
  errored: boolean;
  focused: boolean;
  setValue: (value: Value) => void;
  errorMessage: string | undefined;

  attributes: {
    id: string;
    ref: React.Ref<Element>;
    value: Value;
    error: boolean;
    onBlur: VoidFunction;
    onFocus: VoidFunction;
    disabled?: boolean;
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
  disabled?: boolean;
  transform?: (value: Value) => Value;
  autoFocus?: boolean;
  allowEmpty?: boolean;
  autoFocusIfEmpty?: boolean;

  /**
   * if true - onSave will be called on unmount, should be static value
   * @default true
   */
  saveOnUnmount?: boolean;
}

interface InputProps<Value, Element> extends BaseInputProps<Value, Element> {
  onSave: (value: Value) => void;
  isEmpty?: (value: Value) => boolean;
  flushSyncOnFocus?: boolean;
}

export const useInput = <Value, Element extends { focus: VoidFunction } = HTMLInputElement>({
  ref: propRef,
  value: propValue,
  error,
  onSave,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  onEmpty,
  isEmpty = (value) => !value,
  disabled,
  transform,
  autoFocus: autoFocusProp = false,
  allowEmpty = true,
  saveOnUnmount = true,
  flushSyncOnFocus,
  autoFocusIfEmpty: autoFocusIfEmptyProp = false,
}: InputProps<Value, Element>): InputAPI<Value, Element> => {
  const id = useExternalID();
  const ref = useRef<Element>(null);
  const focus = useInputFocus();
  const changedRef = useRef(false);

  const [value, setValue] = useLinkedState(propValue);
  const [empty, setEmpty] = useState(() => isEmpty(value));

  const onChange = usePersistFunction((newValue: Value) => {
    if (disabled) return;

    const transformedValue = transform?.(newValue) ?? newValue;

    changedRef.current = value !== transformedValue;
    setValue(transformedValue);

    if (!onEmpty) return;

    const nextEmpty = isEmpty(value);

    if (empty !== nextEmpty) {
      setEmpty(nextEmpty);
      onEmpty(nextEmpty);
    }
  });

  const onFocus = usePersistFunction(() => {
    if (disabled) return;

    if (flushSyncOnFocus) {
      flushSync(() => focus.attributes.onFocus());
    } else {
      focus.attributes.onFocus();
    }

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
    if (!autoFocus || disabled) return undefined;

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

  const errored = !focus.active && !!error;

  return {
    id,
    ref,
    value,
    empty,
    errored,
    focused: focus.active,
    setValue: onChange,
    errorMessage: errored ? error : undefined,

    attributes: {
      id,
      ref: RefUtil.composeRefs(ref, propRef),
      error: errored,
      value,
      onBlur,
      onFocus,
      disabled,
      autoFocus,
      onValueChange: onChange,
    },
  };
};

interface UseInputStateOptions<Value, Error> {
  value?: Value;
  error?: Error | null;
}

interface UseInputStateAPI<Value, Error> {
  value: Value;
  error: Error | null;
  setValue: (value: Value | ((prevValue: Value) => Value)) => void;
  setError: (value: Error | null) => void;
  resetError: VoidFunction;
}

interface IUseInputState {
  <Value = string, Error = string>(options?: UseInputStateOptions<Value, Error>): UseInputStateAPI<Value, Error>;
}

/**
 * resets error on value change
 */
export const useInputState: IUseInputState = ({ value: propValue, error: propError = null } = {}) => {
  const [value, setValue] = useLinkedState<any>(propValue ?? '');
  const [error, setError] = useLinkedState(propError);

  const onValueChange = usePersistFunction((newValue: any) => {
    setError(null);
    setValue(newValue);
  });

  return {
    value,
    error,
    setError,
    setValue: onValueChange,
    resetError: () => setError(null),
  };
};

/**
 * cleans autoFocusKey on next render to don't focus on the same input twice
 */
export const useInputAutoFocusKey = (): { key: string; setKey: React.Dispatch<React.SetStateAction<string>> } => {
  const [key, setKey] = useState('');

  useEffect(() => {
    if (!key) return undefined;

    const frame = requestAnimationFrame(() => setKey(''));

    return () => cancelAnimationFrame(frame);
  }, [key]);

  return { key, setKey };
};
