import React from 'react';
import { Redirect } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Designer, Session } from '@/ducks';
import { useTeardown } from '@/hooks/lifecycle';
import { useRouteVersionID } from '@/hooks/routes';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { AssistantChannelSubscriptionGate, MigrationGate, SchemaChannelSubscriptionGate } from './components';
import { VersionSubscriptionContext } from './types';

const VersionSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const versionID = useRouteVersionID();

  const [context, setContext] = React.useState<VersionSubscriptionContext | null>(null);

  const subscriptionRevision = useSelector(Designer.Environment.selectors.gateSubscriptionRevision);

  const setActiveProjectID = useDispatch(Session.setActiveProjectID);
  const setActiveVersionID = useDispatch(Session.setActiveVersionID);
  const setActiveDiagramID = useDispatch(Session.setActiveDiagramID);

  useTeardown(() => {
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
          <AssistantChannelSubscriptionGate
            key={subscriptionRevision}
            projectID={context.projectID}
            versionID={versionID}
            workspaceID={context.workspaceID}
          >
            {children}
          </AssistantChannelSubscriptionGate>
        )}
      </MigrationGate>
    </SchemaChannelSubscriptionGate>
  );
};

export default React.memo(VersionSubscriptionGate);
