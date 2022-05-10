import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NamespaceContext } from '@/contexts';
import * as Creator from '@/ducks/creator';
import { useTeardown } from '@/hooks';

export const useSectionState = <T>({
  autoSave = true,
  sectionKey,
  defaultValue,
}: {
  autoSave?: boolean;
  sectionKey: null | string | string[];
  defaultValue: T;
}): [state: T, setState: (state: T) => void] => {
  const dispatch = useDispatch();
  const getReduxState = useSelector(Creator.sectionStateSelector);

  const namespace = React.useContext(NamespaceContext);

  const localNamespace = Array.isArray(sectionKey) ? sectionKey.join('.') : sectionKey;
  const actualKey = namespace && localNamespace ? `${namespace}.${localNamespace}` : namespace || localNamespace;

  const reduxState = actualKey ? ((getReduxState(actualKey) ?? null) as T | null) : null;
  const state = reduxState ?? defaultValue;
  const isStateSynced = state === reduxState;

  const setState = React.useCallback((value: T) => dispatch(Creator.setSectionState(actualKey!, value)), [actualKey, dispatch]);

  useTeardown(() => {
    if (autoSave && !isStateSynced) {
      setState(state);
    }
  }, [autoSave, isStateSynced, state, setState]);

  return [state, setState];
};
