import React from 'react';

import { NamespaceContext } from '@/contexts/NamespaceContext';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { useEnvironmentSessionStorageState } from '@/hooks/storage.hook';

export const useSectionState = <T>({ sectionKey, defaultValue }: { sectionKey: null | string | string[]; defaultValue: T }) => {
  const namespace = React.useContext(NamespaceContext);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);

  const localNamespace = Array.isArray(sectionKey) ? sectionKey.join('.') : sectionKey;
  const actualKey = namespace && localNamespace ? `${namespace}.${localNamespace}` : namespace || localNamespace;

  return useEnvironmentSessionStorageState<T>(`sections:${activeDiagramID}:${actualKey}`, defaultValue);
};
