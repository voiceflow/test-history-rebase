import { useCallback } from 'react';
import * as ReactRedux from 'react-redux';

import type { Dispatchable, Selector, State, Store } from '@/store/types';

import { useLinkedState } from './linked';

export const useAdvancedSelector = ReactRedux.useSelector;

export const useSelector = <T, A extends any[]>(selector: Selector<T, A>, ...args: A): T =>
  useAdvancedSelector<State, T>((state) => selector(state, ...args));

export const useStore = ReactRedux.useStore as () => Store;

export const useBoundValue = <T>(selector: Selector<T>, createAction: (value: NonNullable<T>) => Dispatchable | null) => {
  const stateValue = ReactRedux.useSelector(selector);
  const [localValue, setLocalValue] = useLinkedState(stateValue);
  const dispatch = ReactRedux.useDispatch();

  const saveValue = useCallback(() => {
    const result = createAction(localValue!);

    if (result) {
      dispatch(result);
    }
  }, [localValue]);

  return [localValue, setLocalValue, saveValue] as const;
};
