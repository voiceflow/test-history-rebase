import { FeatureFlag } from '@voiceflow/realtime-sdk';
import React from 'react';
import { Redirect } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Session } from '@/ducks';
import { useFeature } from '@/hooks/feature';
import { useTeardown } from '@/hooks/lifecycle';
import { useDispatch } from '@/hooks/realtime';
import { useRouteVersionID } from '@/hooks/routes';

import { AssistantChannelSubscriptionGate, MigrationGate, SchemaChannelSubscriptionGate } from './components';
import { VersionSubscriptionContext } from './types';

const VersionSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const versionID = useRouteVersionID();
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  const [context, setContext] = React.useState<VersionSubscriptionContext | null>(null);

  const setActiveDomainID = useDispatch(Session.setActiveDomainID);
  const setActiveProjectID = useDispatch(Session.setActiveProjectID);
  const setActiveVersionID = useDispatch(Session.setActiveVersionID);
  const setActiveDiagramID = useDispatch(Session.setActiveDiagramID);

  useTeardown(() => {
    if (!cmsWorkflows.isEnabled) {
      setActiveDomainID(null);
    }

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
          <AssistantChannelSubscriptionGate workspaceID={context.workspaceID} projectID={context.projectID} versionID={versionID}>
            {children}
          </AssistantChannelSubscriptionGate>
        )}
      </MigrationGate>
    </SchemaChannelSubscriptionGate>
  );
};

export default React.memo(VersionSubscriptionGate);
