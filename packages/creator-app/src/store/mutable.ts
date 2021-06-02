import { Nullable } from '@/types';

interface MutableStore {
  lastRealtimeTimestamp: Nullable<number>;
}

const INITIAL_STATE: Readonly<MutableStore> = {
  lastRealtimeTimestamp: null,
};

let MUTABLE_STORE: MutableStore = { ...INITIAL_STATE };

const createGetter =
  <T extends keyof MutableStore>(key: T) =>
  (): MutableStore[T] =>
    MUTABLE_STORE[key];

const createSetter =
  <T extends keyof MutableStore>(key: T) =>
  <V extends MutableStore[T]>(value: V): V =>
    Object.assign(MUTABLE_STORE, { [key]: value })[key] as V;

const mutableStoreApi = {
  getRTCTimestamp: (): string => mutableStoreApi.getLastRealtimeTimestamp()?.toString() ?? '',
  getLastRealtimeTimestamp: createGetter('lastRealtimeTimestamp'),
  setLastRealtimeTimestamp: createSetter('lastRealtimeTimestamp'),

  reset: () => {
    MUTABLE_STORE = { ...INITIAL_STATE };
  },
} as const;

export default mutableStoreApi;
