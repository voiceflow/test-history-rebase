import { useState } from 'react';

export const useFormState = <T>({
  onSubmit: onSubmitProp,
  initialState,
}: {
  onSubmit: (data: T) => void;
  initialState: T;
}) => {
  const [error, setError] = useState<null | string>(null);
  const [state, setState] = useState<T>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [stateError, setStateError] = useState<null | Record<keyof T, string>>(null);

  const onSubmit = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);

      await onSubmitProp(state);

      setError(null);
    } catch {
      setError('An error occurred, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onFieldChange = (key: keyof T) => (value: T[keyof T]) => {
    setError(null);
    setState((state) => ({ ...state, [key]: value }));
    setStateError((prev) => prev && { ...prev, [key]: null });
  };

  return {
    error,
    state,
    onSubmit,
    submitting,
    stateError,
    onFieldChange,
  };
};
