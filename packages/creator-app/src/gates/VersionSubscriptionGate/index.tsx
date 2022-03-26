import React from 'react';
import { batch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import client from '@/client';
import LoadingGate from '@/components/LoadingGate';
import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useRouteVersionID, useSelector, useTeardown, useVersionSubscription } from '@/hooks';

import CommentingUpdates from './CommentingUpdates';
import { ProjectReconnectGate } from './gates';
import TranscriptUpdates from './TranscriptsUpdates';

interface VersionContext {
  workspaceID: string;
  projectID: string;
}

const VersionSubscriptionGate: React.FC = ({ children }) => {
  const versionID = useRouteVersionID();
  const activeVersionID = useSelector(Session.activeVersionIDSelector);

  const [context, setContext] = React.useState<VersionContext | null>(null);
  const goToDashboard = useDispatch(Router.goToDashboard);
  const setActiveProjectID = useDispatch(Session.setActiveProjectID);
  const setActiveVersionID = useDispatch(Session.setActiveVersionID);
  const setActiveDiagramID = useDispatch(Session.setActiveDiagramID);

  const isSubscribed = useVersionSubscription({ versionID, projectID: context?.projectID, workspaceID: context?.workspaceID }, [context], {
    disabled: !context,
  });

  const loadContext = React.useCallback(async () => {
    if (!versionID) return;

    try {
      const { projectID } = await client.api.version.get(versionID);
      const { teamID: workspaceID } = await client.api.project.get(projectID);

      setContext({ workspaceID, projectID });
    } catch {
      goToDashboard();
    }
  }, [versionID]);

  useTeardown(() =>
    batch(() => {
      setActiveProjectID(null);
      setActiveVersionID(null);
      setActiveDiagramID(null);
    })
  );

  if (!versionID) {
    return <Redirect to={Path.DASHBOARD} />;
  }

  return (
    <LoadingGate
      label="Project"
      internalName={VersionSubscriptionGate.name}
      isLoaded={isSubscribed && versionID === activeVersionID}
      load={loadContext}
      backgroundColor="#f9f9f9"
    >
      <CommentingUpdates />
      <TranscriptUpdates />
      <ProjectReconnectGate />
      {children}
    </LoadingGate>
  );
};

export default React.memo(VersionSubscriptionGate);
