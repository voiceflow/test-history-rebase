import { useAtomValue } from 'jotai';
import { ScopeProvider } from 'jotai-molecules';
import React, { useMemo } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import { CMSRouteFoldersScope } from './CMSRouteFolders.atom';
import { useCMSRouteFolders } from './CMSRouteFolders.hook';
import type { ICMSRouteFoldersProvider } from './CMSRouteFolders.interface';

const CMSFoldersRoutesRoute: React.FC<ICMSRouteFoldersProvider> = ({ pathname, folderScope, Component }) => {
  const { folderID: activeFolderID = null } = useParams<{ folderID: string }>();

  const routeFolders = useCMSRouteFolders();
  const activeFolder = useSelector(Designer.Folder.selectors.oneByID, { id: activeFolderID });

  const value = useMemo(
    () => ({ folders: routeFolders.folders, pathname, folderScope, folderID: activeFolder?.id ?? null }),
    [routeFolders.folders, pathname, folderScope, activeFolder]
  );

  if (activeFolderID && !activeFolder) return <Redirect to="../.." />;

  return (
    <ScopeProvider key={activeFolderID} scope={CMSRouteFoldersScope} value={value}>
      <CMSRouteFoldersRoutes pathname={pathname} folderScope={folderScope} Component={Component} />
    </ScopeProvider>
  );
};

const CMSRouteFoldersRoutes: React.FC<ICMSRouteFoldersProvider> = ({ Component, ...props }) => {
  const routeFolders = useCMSRouteFolders();
  const pathname = useAtomValue(routeFolders.activeFolderPathname);

  return (
    <Switch>
      <Route path={`${pathname}/folder/:folderID`} render={() => <CMSFoldersRoutesRoute {...props} Component={Component} />} />

      <Route path={`${pathname}/:resourceID?`} component={Component} />
    </Switch>
  );
};

export const CMSRouteFoldersProvider: React.FC<ICMSRouteFoldersProvider> = (props) => <CMSFoldersRoutesRoute {...props} />;
