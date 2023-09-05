import { ScopeProvider } from 'jotai-molecules';
import React, { useMemo } from 'react';
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import { CMSRouteFoldersScope } from './CMSRouteFolders.atom';
import { useCMSRouteFolders } from './CMSRouteFolders.hook';
import type { ICMSRouteFoldersProvider } from './CMSRouteFolders.interface';

const CMSFoldersRoutesRoute: React.FC<ICMSRouteFoldersProvider> = ({ Component, countSelector }) => {
  const { folderID: activeFolderID = null } = useParams<{ folderID: string }>();

  const { folders } = useCMSRouteFolders();
  const activeFolder = useSelector(Designer.Folder.selectors.oneByID, { id: activeFolderID });

  const value = useMemo(() => ({ folders, countSelector, activeFolderID: activeFolder?.id ?? null }), [folders, activeFolder, countSelector]);

  if (activeFolderID && !activeFolder) return <Redirect to="../.." />;

  return (
    <ScopeProvider key={String(activeFolder?.id)} scope={CMSRouteFoldersScope} value={value}>
      <CMSRouteFoldersRoutes Component={Component} countSelector={countSelector} />
    </ScopeProvider>
  );
};

const CMSRouteFoldersRoutes: React.FC<ICMSRouteFoldersProvider> = ({ Component, countSelector }) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/folder/:folderID`} render={() => <CMSFoldersRoutesRoute Component={Component} countSelector={countSelector} />} />

      <Route path={match.url} component={Component} />
    </Switch>
  );
};

export const CMSRouteFoldersProvider: React.FC<ICMSRouteFoldersProvider> = ({ Component, countSelector }) => (
  <CMSRouteFoldersRoutes Component={Component} countSelector={countSelector} />
);
