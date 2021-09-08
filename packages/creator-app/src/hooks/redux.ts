import { useCallback } from 'react';
import * as ReactRedux from 'react-redux';

import { Dispatchable, Selector, Store } from '@/store/types';

import { useLinkedState } from './linked';

export { useSelector } from 'react-redux';

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
