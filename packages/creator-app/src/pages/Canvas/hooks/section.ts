import React from 'react';

import { NamespaceContext } from '@/contexts';
import { useTeardown } from '@/hooks';

// TODO: structured method to clear from memory
const localSectionStateStore: Record<string, unknown> = {};

export const useSectionState = <T>({
  autoSave = true,
  sectionKey,
  defaultValue,
}: {
  autoSave?: boolean;
  sectionKey: null | string | string[];
  defaultValue: T;
}): [state: T, setState: (state: T) => void] => {
  const namespace = React.useContext(NamespaceContext);

  const localNamespace = Array.isArray(sectionKey) ? sectionKey.join('.') : sectionKey;
  const actualKey = namespace && localNamespace ? `${namespace}.${localNamespace}` : namespace || localNamespace;

  const reduxState = actualKey ? ((localSectionStateStore[actualKey] ?? null) as T | null) : null;
  const state = reduxState ?? defaultValue;
  const isStateSynced = state === reduxState;

  const setState = React.useCallback((value: T) => {
    localSectionStateStore[actualKey!] = value;
  }, []);

  useTeardown(() => {
    if (autoSave && !isStateSynced) {
      setState(state);
    }
  }, [autoSave, isStateSynced, state, setState]);

  return [state, setState];
};
