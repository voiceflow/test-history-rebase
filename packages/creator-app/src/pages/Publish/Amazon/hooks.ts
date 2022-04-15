import { useCallback, useContext } from 'react';

import { ValidationContext } from './contexts';

export const useValidator = <T>(name: string, validate: (value: T) => string | false) => {
  const validationContext = useContext(ValidationContext);

  const validator = useCallback(
    <R>(submit: (value: T) => R) =>
      (value: T) => {
        const error = validate(value);

        if (error) {
          validationContext?.setError(name, error);
          return null;
        }

        validationContext?.setError(name, null);
        return submit(value);
      },
    [name]
  );

  return [validationContext?.errors?.[name] ?? null, validator] as const;
};
