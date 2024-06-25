import { useCreateConst, usePersistFunction } from '@voiceflow/ui-next';
import { useCallback } from 'react';
import * as ReactRedux from 'react-redux';

import type { State as AppState } from '@/ducks';
import type { AnyAction, Dispatchable, DispatchResult, Selector, Store } from '@/store/types';

export const useStore = ReactRedux.useStore as () => Store;

export const useDispatch = <S extends any[], D extends any[], R extends Dispatchable>(
  createAction: (...args: [...S, ...D]) => R,
  ...staticArgs: S
) => {
  const store = useStore();

  return useCallback(
    (...dynamicArgs: D): DispatchResult<R> => store.dispatch(createAction(...staticArgs, ...dynamicArgs)),
    staticArgs
  );
};

export const useLocalDispatch = <S extends any[], D extends any[], R extends AnyAction>(
  createAction: (...args: [...S, ...D]) => R,
  ...staticArgs: S
) => {
  const store = useStore();

  return useCallback(
    (...dynamicArgs: D) => store.dispatch.local(createAction(...staticArgs, ...dynamicArgs)),
    staticArgs
  );
};

export const useCrossTabDispatch = <S extends any[], D extends any[], R extends AnyAction>(
  createAction: (...args: [...S, ...D]) => R,
  ...staticArgs: S
) => {
  const store = useStore();

  return useCallback(
    (...dynamicArgs: D) => store.dispatch.crossTab(createAction(...staticArgs, ...dynamicArgs)),
    staticArgs
  );
};

export const useSyncDispatch = <S extends any[], D extends any[], R extends AnyAction>(
  createAction: (...args: [...S, ...D]) => R,
  ...staticArgs: S
) => {
  const store = useStore();

  return useCallback(
    (...dynamicArgs: D) => store.dispatch.sync(createAction(...staticArgs, ...dynamicArgs)),
    staticArgs
  );
};

export const useSelector = <T, A extends any[]>(selector: Selector<T, A>, ...args: A): T =>
  ReactRedux.useSelector<AppState, T>((state) => selector(state, ...args));

/**
 * selects data from the store on the initial render only, doesn't subscribe to changes
 */
export const useInitialValueSelector = <T, A extends any[]>(selector: Selector<T, A>, ...args: A): T => {
  const store = useStore();

  return useCreateConst(() => selector(store.getState(), ...args));
};

/**
 * returns a memoized value getter, doesn't subscribe to changes, useful for scenarios where we need store data in a callback (fe validations)
 */
export const useGetValueSelector = <T, A extends any[], D extends any[]>(
  selector: Selector<T, [...A, ...D]>,
  ...staticArgs: A
): ((...dynamicArgs: D) => T) => {
  const store = useStore();

  return usePersistFunction((...dynamicArgs: D) => selector(store.getState(), ...staticArgs, ...dynamicArgs));
};
