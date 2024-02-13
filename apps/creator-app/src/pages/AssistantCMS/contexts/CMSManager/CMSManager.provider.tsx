import { useAtomValue } from 'jotai';
import { ScopeProvider } from 'jotai-molecules';
import React, { useMemo } from 'react';

import { Session } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import { useCMSRouteFolders } from '../CMSRouteFolders';
import { CMSResourceScope } from './CMSManager.atom';
import type { CMSResource, CMSResourceSearchContext, ICMSManagerProvider } from './CMSManager.interface';

export const CMSManagerProvider = <Item extends CMSResource, SearchContext extends CMSResourceSearchContext = CMSResourceSearchContext>({
  children,
  staticConfig,
}: ICMSManagerProvider<Item, SearchContext>) => {
  const versionID = useSelector(Session.activeVersionIDSelector) ?? '';
  const routeFolders = useCMSRouteFolders();
  const activeFolderID = useAtomValue(routeFolders.activeFolderID);
  const activeFolderScope = useAtomValue(routeFolders.activeFolderScope);
  const activeFolderPathname = useAtomValue(routeFolders.activeFolderPathname);

  const config = useMemo(
    () => ({
      ...staticConfig,
      pathname: activeFolderPathname,
      folderID: activeFolderID,
      versionID,
      folderScope: activeFolderScope,
      searchContext: staticConfig.searchContext,
    }),
    [versionID, activeFolderID, activeFolderScope, activeFolderPathname]
  );

  if (!versionID) return null;

  return (
    <ScopeProvider scope={CMSResourceScope} value={config}>
      {children}
    </ScopeProvider>
  );
};
