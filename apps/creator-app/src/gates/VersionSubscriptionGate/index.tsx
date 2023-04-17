import React from 'react';
import { Redirect } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useDispatch, useRouteVersionID, useTeardown } from '@/hooks';

import { MigrationGate, SchemaChannelSubscriptionGate, VersionChannelSubscriptionGate } from './components';
import { VersionSubscriptionContext } from './types';

const VersionSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const versionID = useRouteVersionID();

  const [context, setContext] = React.useState<VersionSubscriptionContext | null>(null);

  const setActiveDomainID = useDispatch(Session.setActiveDomainID);
  const setActiveProjectID = useDispatch(Session.setActiveProjectID);
  const setActiveVersionID = useDispatch(Session.setActiveVersionID);
  const setActiveDiagramID = useDispatch(Session.setActiveDiagramID);

  useTeardown(() => {
    setActiveDomainID(null);
    setActiveProjectID(null);
    setActiveVersionID(null);
    setActiveDiagramID(null);
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
