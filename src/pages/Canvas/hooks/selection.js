import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NamespaceContext } from '@/contexts';
import * as Creator from '@/ducks/creator';
import { useTeardown } from '@/hooks';

// eslint-disable-next-line import/prefer-default-export
export const useSectionState = (sectionKey = null, defaultValue = null, autoSave = true) => {
  const dispatch = useDispatch();
  const namespace = React.useContext(NamespaceContext);
  const localNamespace = Array.isArray(sectionKey) ? sectionKey.join('.') : sectionKey;
  const actualKey = namespace && localNamespace ? `${namespace}.${localNamespace}` : namespace || localNamespace;
  const reduxState = useSelector(Creator.sectionStateSelector)(actualKey);
  const state = reduxState ?? defaultValue;
  const isStateSynced = state === reduxState;

  const setState = React.useCallback((value) => dispatch(Creator.setSectionState(actualKey, value)), [actualKey, dispatch]);

  useTeardown(() => {
    if (autoSave && !isStateSynced) {
      setState(state);
    }
  }, [autoSave, isStateSynced, state, setState]);

  return [state, setState];
};
