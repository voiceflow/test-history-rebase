import React from 'react';
import { Redirect } from 'react-router-dom';

import client from '@/client';
import LoadingGate from '@/components/LoadingGate';
import { Path } from '@/config/routes';
import { RealtimeProjectProvider } from '@/contexts/RealtimeProjectContext';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { useRouteDiagramID, useRouteVersionID } from '@/hooks';
import { ConnectedProps, MergeArguments } from '@/types';
import * as Sentry from '@/vendors/sentry';

import RealtimeProjectSubscription from '../RealtimeProjectSubscription';
import RealtimeVersionSubscription from '../RealtimeVersionSubscription';
import CommentingUpdates from './CommentingUpdates';
import TranscriptUpdates from './TranscriptsUpdates';

const ProjectLoadingGate: React.FC<ConnectedProjectLoadingGateProps> = ({
  activeVersion,
  activateVersion,
  joinProjectChannel,
  setError,
  children,
}) => {
  const versionID = useRouteVersionID();
  const diagramID = useRouteDiagramID() ?? undefined;

  const loadProjectAndJoinChannel = React.useCallback(async () => {
    try {
      const version = await activateVersion(versionID!, diagramID);

      await joinProjectChannel(version.projectID);
    } catch (e) {
      Sentry.error(e);
      setError(e);
    }
  }, [activateVersion, joinProjectChannel, setError]);

  React.useEffect(
    () =>
      client.socket.global.watchForReconnected(() => {
        joinProjectChannel();
      }),
    [joinProjectChannel]
  );

  if (!versionID) {
    return <Redirect to={Path.DASHBOARD} />;
  }

  return (
    <LoadingGate label="Project" isLoaded={!!activeVersion && versionID === activeVersion.id} load={loadProjectAndJoinChannel}>
      <RealtimeProjectSubscription />
      <RealtimeVersionSubscription />
      <CommentingUpdates />
      <TranscriptUpdates />
      <RealtimeProjectProvider>{children}</RealtimeProjectProvider>
    </LoadingGate>
  );
};

const mapStateToProps = {
  activeVersion: Version.activeVersionSelector,
  activeProjectID: Session.activeProjectIDSelector,
};

const mapDispatchToProps = {
  activateVersion: Version.activateVersion,
  setError: Modal.setError,
  joinProjectChannel: Project.setupProjectSocketConnection,
};

const mergeProps = (...[{ activeProjectID }, { joinProjectChannel }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  joinProjectChannel: (projectID = activeProjectID) => projectID && joinProjectChannel(projectID),
});

type ConnectedProjectLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProjectLoadingGate);
