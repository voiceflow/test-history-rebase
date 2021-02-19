export type Persistor<V> = {
  get: () => V | null;
  set: (value: V) => void;
  getRaw: () => string | null;
};

export const createPersistor = <S extends { setItem: (key: string, value: string) => void; getItem: (key: string) => null | string }, V>(
  store: S,
  key: string
): Persistor<V> => {
  const getRaw = () => store.getItem(key);
  const set = (value: V) => store.setItem(key, JSON.stringify(value));
  const get = () => {
    try {
      return JSON.parse(getRaw() || '') as V;
    } catch {
      return null;
    }
  };

  return {
    set,
    get,
    getRaw,
  };
};
