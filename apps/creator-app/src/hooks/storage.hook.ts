import { useCreateConst } from '@voiceflow/ui-next';
import { useCallback, useState } from 'react';

import { Session } from '@/ducks';

import { useSelector } from './store.hook';

interface Storage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

const createUseStorageHook =
  <S extends Storage>(storage: S) =>
  <T>(name: string, defaultValue: T) =>
    useCreateConst(() => ({
      get: (): T => {
        try {
          const item = storage.getItem(name);

          return item === null ? defaultValue : JSON.parse(item);
        } catch {
          return defaultValue;
        }
      },

      set: (value: T) => storage.setItem(name, JSON.stringify(value)),

      clear: () => storage.removeItem(name),
    }));

const createUseStorageStateHook = <S extends Storage>(storage: S) => {
  const useStorage = createUseStorageHook(storage);

  return <T>(name: string, initialState: T) => {
    const storage = useStorage(name, initialState);
    const [value, setValue] = useState(storage.get);

    const setStorageValue = useCallback<React.Dispatch<React.SetStateAction<T>>>((value) => {
      setValue((prevState) => {
        let nextValue: T;

        if (typeof value === 'function') {
          nextValue = (value as (prevState: T) => T)(prevState);
        } else {
          nextValue = value;
        }

        storage.set(nextValue);

        return nextValue;
      });
    }, []);

    return [value, setStorageValue] as const;
  };
};

const createUseSelectorStorageStateHook =
  (
    scope: string,
    selector: (state: any) => string | null,
    useHook: ReturnType<typeof createUseStorageStateHook>
  ): ReturnType<typeof createUseStorageStateHook> =>
  (name, initialState) => {
    const scopeID = useSelector(selector);

    return useHook(`${scope}:${scopeID ?? 'unknown'}:${name}`, initialState);
  };

export const useLocalStorage = createUseStorageHook(globalThis.localStorage);
export const useSessionStorage = createUseStorageHook(globalThis.localStorage);

export const useLocalStorageState = createUseStorageStateHook(globalThis.localStorage);
export const useSessionStorageState = createUseStorageStateHook(globalThis.sessionStorage);

export const useAssistantSessionStorageState = createUseSelectorStorageStateHook(
  'assistant',
  Session.activeProjectIDSelector,
  useSessionStorageState
);

export const useEnvironmentSessionStorageState = createUseSelectorStorageStateHook(
  'environment',
  Session.activeVersionIDSelector,
  useSessionStorageState
);
