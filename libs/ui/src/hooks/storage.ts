import React from 'react';

interface Storage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

const createUseStorageStateHook = <S extends Storage>(storage: S) => {
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

    const setStorageState = React.useCallback<React.Dispatch<React.SetStateAction<T>>>((value) => {
      setState((prevState) => {
        if (typeof value === 'function') {
          const newValue = (value as (prevState: T) => T)(prevState);

          storage.setItem(name, JSON.stringify(newValue));

          return newValue;
        }

        storage.setItem(name, JSON.stringify(value));
        return value;
      });
    }, []);

    return [state, setStorageState] as const;
  };
};

const createUseStorageHook = <S extends Storage>(storage: S) => {
  return <T>(name: string, defaultValue: T) => {
    const getStorage = React.useCallback((): T => {
      const item = storage.getItem(name);
      return item === null ? defaultValue : JSON.parse(item);
    }, []);

    const setStorage = React.useCallback((value: T) => {
      storage.setItem(name, JSON.stringify(value));
    }, []);

    const clearStorage = React.useCallback(() => {
      storage.removeItem(name);
    }, []);

    return [getStorage, setStorage, clearStorage] as const;
  };
};

export const useLocalStorage = createUseStorageHook(globalThis.localStorage);

export const useLocalStorageState = createUseStorageStateHook(globalThis.localStorage);
export const useSessionStorageState = createUseStorageStateHook(globalThis.sessionStorage);
