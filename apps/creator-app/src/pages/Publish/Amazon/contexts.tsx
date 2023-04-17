import React, { useCallback, useMemo } from 'react';

export interface ValidationContext {
  isValid: boolean;
  errors: Record<string, string | null>;
  setError: (name: string, error: string | null) => void;
}

export const ValidationContext = React.createContext<ValidationContext | null>(null);
export const { Consumer: ValidationConsumer } = ValidationContext;

export const ValidationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [errors, setErrors] = React.useState<Record<string, string | null>>({});

  const isValid = useMemo(() => !Object.values(errors).some(Boolean), [errors]);
  const setError = useCallback((name: string, error: string | null) => setErrors((errs) => ({ ...errs, [name]: error })), []);

  const api = useMemo(() => ({ isValid, errors, setError }), [isValid, errors, setError]);

  return <ValidationContext.Provider value={api}>{children}</ValidationContext.Provider>;
};
