import type { RootReducer } from '@/store/types';

const PERSIST_KEY = 'persist';

export interface Persistor<V> {
  get: () => V | null;
  set: (value: V) => void;
  getRaw: () => string | null;
}

type NotUndefined = null | boolean | number | string | any[] | Record<string, any>;

/**
 * the only rule of persistor club is that `undefined` is reserved for the uninitialized state
 */
const createPersistor =
  (store: Storage) =>
  <T extends NotUndefined = never>(
    stateKey: string,
    key: string
  ): [T] extends [never] ? Persistor<never> : Persistor<T> => {
    const namespacedKey = `${PERSIST_KEY}:${stateKey}:${key}`;
    const getRaw = () => store.getItem(namespacedKey);
    const set = (value: T) => store.setItem(namespacedKey, JSON.stringify({ value }));
    const get = () => {
      try {
        const parsed = JSON.parse(getRaw() || '');

        if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
          return null;
        }

        return (parsed?.value as T) ?? null;
      } catch {
        return null;
      }
    };

    return {
      set,
      get,
      getRaw,
    } as any;
  };

/**
 * persistor backed by sessionStorage
 */
export const sessionPersistor = createPersistor(sessionStorage);

/**
 * persistor backed by localStorage
 */
export const localPersistor = createPersistor(localStorage);

/**
 * attempt to rehydrate from choice of persistor
 * if not found, use initialState and store using persistor
 */
export const rehydrateReducer =
  <T extends NotUndefined>(persistor: Persistor<T>, initialValue: T): RootReducer<T, any> =>
  (state) => {
    if (state !== undefined) {
      return state;
    }

    const persistedState = persistor.get();

    if (persistedState !== null) {
      return persistedState;
    }

    persistor.set(initialValue);

    return initialValue;
  };

/**
 * attempt to rehydrate from choice of persistor
 * if not found, use initialState and store using persistor
 * subsequent state changes should all be stored using persistor
 */
export const persistReducer = <T extends NotUndefined, A>(
  persistor: Persistor<T>,
  reducer: RootReducer<T, A>
): RootReducer<T, A> => {
  let previousState: T | null = null;

  return (state, action) => {
    const currentState = state === undefined ? persistor.get() ?? undefined : state;
    const nextState = reducer(currentState, action);

    if (nextState !== previousState) {
      previousState = nextState;
      persistor.set(nextState);
    }

    return nextState;
  };
};
