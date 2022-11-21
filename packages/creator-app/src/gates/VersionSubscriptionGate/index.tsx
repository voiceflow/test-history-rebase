import { datadogRum } from '@datadog/browser-rum';
import React from 'react';
import { batch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useDispatch, useRouteVersionID, useSelector, useTeardown } from '@/hooks';

import { MigrationGate, SchemaChannelSubscriptionGate, VersionChannelSubscriptionGate } from './components';
import { VersionSubscriptionContext } from './types';

const VersionSubscriptionGate: React.FC = ({ children }) => {
  const versionID = useRouteVersionID();

  const [context, setContext] = React.useState<VersionSubscriptionContext | null>(null);

  const setActiveDomainID = useDispatch(Session.setActiveDomainID);
  const setActiveProjectID = useDispatch(Session.setActiveProjectID);
  const setActiveVersionID = useDispatch(Session.setActiveVersionID);
  const setActiveDiagramID = useDispatch(Session.setActiveDiagramID);

  const activeProjectID = useSelector(Session.activeProjectIDSelector);
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const activeDomainID = useSelector(Session.activeDomainIDSelector);
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);

  datadogRum.setUserProperty('project_id', activeProjectID);
  datadogRum.setUserProperty('version_id', activeVersionID);
  datadogRum.setUserProperty('diagram_id', activeDiagramID);
  datadogRum.setUserProperty('domain_id', activeDomainID);
  datadogRum.setUserProperty('workspace_id', activeWorkspaceID);

  useTeardown(() => {
    datadogRum.removeUserProperty('project_id');
    datadogRum.removeUserProperty('version_id');
    datadogRum.removeUserProperty('diagram_id');
    datadogRum.removeUserProperty('domain_id');
    datadogRum.removeUserProperty('workspace_id');

    batch(() => {
      setActiveDomainID(null);
      setActiveProjectID(null);
      setActiveVersionID(null);
      setActiveDiagramID(null);
    });
  });

  if (!versionID) {
    return <Redirect to={Path.DASHBOARD} />;
  }

  return (
    <SchemaChannelSubscriptionGate versionID={versionID}>
      <MigrationGate versionID={versionID} context={context} setContext={setContext}>
        {context && (
          <VersionChannelSubscriptionGate workspaceID={context.workspaceID} projectID={context.projectID} versionID={versionID}>
            {children}
          </VersionChannelSubscriptionGate>
        )}
      </MigrationGate>
    </SchemaChannelSubscriptionGate>
  );
};

export default React.memo(VersionSubscriptionGate);
