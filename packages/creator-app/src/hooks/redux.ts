import { useCallback } from 'react';
import * as ReactRedux from 'react-redux';

import { Dispatchable, DispatchResult, Selector } from '@/store/types';

import { useLinkedState } from './linked';

export { useSelector } from 'react-redux';

export const useDispatch = <S extends any[], D extends any[], R extends Dispatchable>(
  createAction: (...args: [...S, ...D]) => R,
  ...staticArgs: S
) => {
  const dispatch = ReactRedux.useDispatch();

  return useCallback((...dynamicArgs: D) => dispatch(createAction(...staticArgs, ...dynamicArgs)) as DispatchResult<R>, staticArgs);
};

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
