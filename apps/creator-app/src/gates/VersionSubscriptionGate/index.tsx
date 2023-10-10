import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Redirect } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useFeature } from '@/hooks/feature';
import { useTeardown } from '@/hooks/lifecycle';
import { useDispatch } from '@/hooks/realtime';
import { useRouteVersionID } from '@/hooks/routes';

import { AssistantChannelSubscriptionGate, MigrationGate, SchemaChannelSubscriptionGate, VersionChannelSubscriptionGate } from './components';
import { VersionSubscriptionContext } from './types';

const VersionSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const v2CMS = useFeature(Realtime.FeatureFlag.V2_CMS);
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

  const AssistantGate = v2CMS.isEnabled ? AssistantChannelSubscriptionGate : VersionChannelSubscriptionGate;

  return (
    <SchemaChannelSubscriptionGate versionID={versionID}>
      <MigrationGate versionID={versionID} context={context} setContext={setContext}>
        {context && (
          <AssistantGate workspaceID={context.workspaceID} projectID={context.projectID} versionID={versionID}>
            {children}
          </AssistantGate>
        )}
      </MigrationGate>
    </SchemaChannelSubscriptionGate>
  );
};

export default React.memo(VersionSubscriptionGate);
