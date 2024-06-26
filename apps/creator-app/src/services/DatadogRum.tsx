import { datadogRum } from '@datadog/browser-rum';
import React from 'react';

import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

const usePropertyTracking = (propertyName: string, propertySelector: (state: any) => string | null) => {
  const propertyValue = useSelector(propertySelector);

  React.useEffect(() => {
    if (!propertyValue) return undefined;

    datadogRum.setUserProperty(propertyName, propertyValue);

    return () => {
      datadogRum.removeUserProperty(propertyName);
    };
  }, [propertyValue]);
};

const DatadogRum: React.FC = () => {
  usePropertyTracking('project_id', Session.activeProjectIDSelector);
  usePropertyTracking('version_id', Session.activeVersionIDSelector);
  usePropertyTracking('diagram_id', Session.activeDiagramIDSelector);
  usePropertyTracking('workspace_id', Session.activeWorkspaceIDSelector);
  usePropertyTracking('organization_id', Workspace.active.organizationIDSelector);

  return null;
};

export default React.memo(DatadogRum);
