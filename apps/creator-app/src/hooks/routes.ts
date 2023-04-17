import React from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';

export const useQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

export const useRouteWorkspaceID = (): string | null => {
  const { params } = useRouteMatch<{ workspaceID?: string }>();

  return params.workspaceID ?? null;
};

export const useRouteVersionID = (): string | null => {
  const { params } = useRouteMatch<{ versionID?: string }>();

  return params.versionID ?? null;
};

export const useRouteDiagramID = (): string | null => {
  const { params } = useRouteMatch<{ diagramID?: string }>();

  return params.diagramID ?? null;
};

export const useRouteDomainID = (): string | null => {
  const { params } = useRouteMatch<{ domainID?: string }>();

  return params.domainID ?? null;
};
