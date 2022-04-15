import React from 'react';

interface Storage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

const createUseStorageHook = <S extends Storage>(storage: S) => {
  const getInitialValue = <T>(name: string, defaultValue: T): T => {
    const strValue = storage.getItem(name);

    try {
      return JSON.parse(strValue ?? '-') as T;
    } catch {
      return defaultValue;
    }
  };

  return <T>(name: string, initialState: T) => {
    const [state, setState] = React.useState<T>(() => getInitialValue(name, initialState));

    const setStorageState = React.useCallback((value: T) => {
      setState(value);
      storage.setItem(name, JSON.stringify(value));
    }, []);

    return [state, setStorageState] as const;
  };
};

export const useLocalStorageState = createUseStorageHook(localStorage);
export const useSessionStorageState = createUseStorageHook(sessionStorage);
