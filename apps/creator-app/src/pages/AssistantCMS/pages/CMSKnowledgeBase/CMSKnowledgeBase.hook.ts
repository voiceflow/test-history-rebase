import { usePersistFunction } from '@voiceflow/ui-next';
import { atom } from 'jotai';
import React from 'react';
import { generatePath } from 'react-router-dom';

import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { KnowledgeBaseContext } from '@/pages/KnowledgeBase/context';

import { PATH_NAME } from './CMSKnowledgeBase.constant';

export const useKBDocumentSync = () => {
  const syncInterval = React.useRef<number | null>(null);
  const { actions } = React.useContext(KnowledgeBaseContext);

  const clearSyncInterval = React.useCallback(() => {
    if (!syncInterval.current) return;
    clearInterval(syncInterval.current);
    syncInterval.current = null;
  }, []);

  React.useEffect(() => {
    actions.sync();
    return clearSyncInterval;
  }, []);

  return { clearSync: clearSyncInterval, syncInterval };
};

export const useCMSKnowledgeBaseRowItemClick = () => {
  const onLinkClick = useOnLinkClick();
  const getAtomValue = useGetAtomValue();
  const { actions } = React.useContext(KnowledgeBaseContext);
  const versionID = atom(useSelector(Session.activeVersionIDSelector));
  const url = atom((get) => generatePath(get(PATH_NAME), { versionID: get(versionID) || undefined }));

  return usePersistFunction((resourceID: string, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    actions.setActiveDocumentID(resourceID);
    const basePath = getAtomValue(url);
    onLinkClick(`${basePath}/${resourceID}`)(event);
  });
};
