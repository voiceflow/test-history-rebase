import { useCreateConst, useLinkedState } from '@voiceflow/ui';
import { useCallback } from 'react';
import * as ReactRedux from 'react-redux';

import type { Dispatchable, Selector, State, Store } from '@/store/types';

export const useAdvancedSelector = ReactRedux.useSelector;

export const useSelector = <T, A extends any[]>(selector: Selector<T, A>, ...args: A): T =>
  useAdvancedSelector<State, T>((state) => selector(state, ...args));

export const useStore = ReactRedux.useStore as () => Store;

export const useInitialValueSelector = <T, A extends any[]>(selector: Selector<T, A>, ...args: A): T => {
  const store = useStore();

  return useCreateConst(() => selector(store.getState(), ...args));
};

export const useBoundValue = <T>(
  selector: Selector<T>,
  createAction: (value: NonNullable<T>) => Dispatchable | null
) => {
  const store = useStore();
  const stateValue = useSelector(selector);
  const [localValue, setLocalValue] = useLinkedState(stateValue);

  const saveValue = useCallback(() => {
    const result = createAction(localValue!);

    if (result) {
      store.dispatch(result);
    }
  }, [localValue]);

  return [localValue, setLocalValue, saveValue] as const;
};
