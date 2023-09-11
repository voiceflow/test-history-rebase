import { ScopeProvider } from 'jotai-molecules';
import React, { useMemo } from 'react';

import { Session } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import { useCMSActiveRouteFolderID } from '../CMSRouteFolders';
import { CMSResourceScope } from './CMSManager.atom';
import type { CMSResource, CMSResourceSearchContext, ICMSManagerProvider } from './CMSManager.interface';

export const CMSManagerProvider = <Item extends CMSResource, SearchContext extends CMSResourceSearchContext = CMSResourceSearchContext>({
  children,
  staticConfig,
}: ICMSManagerProvider<Item, SearchContext>) => {
  const versionID = useSelector(Session.activeVersionIDSelector) ?? '';
  const activeFolderID = useCMSActiveRouteFolderID();

  const config = useMemo(
    () => ({ ...staticConfig, folderID: activeFolderID, versionID, searchContext: staticConfig.searchContext }),
    [versionID, activeFolderID]
  );

  if (!versionID) return null;

  return (
    <ScopeProvider scope={CMSResourceScope} value={config}>
      {children}
    </ScopeProvider>
  );
};
