import React from 'react';
import { Redirect } from 'react-router-dom';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import { Path } from '@/config/routes';
import * as Modal from '@/ducks/modal';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { withFeatureSwitcher } from '@/hocs';
import { useDispatch, useRouteDiagramID, useRouteVersionID, useSelector } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

import ProjectLoadingGateV2 from '../ProjectLoadingGateV2';
import CommentingUpdates from './CommentingUpdates';
import { useProjectChannelReconnect } from './hooks';
import TranscriptUpdates from './TranscriptsUpdates';

const ProjectLoadingGate: React.FC = ({ children }) => {
  const versionID = useRouteVersionID();
  const diagramID = useRouteDiagramID() ?? undefined;
  const activeVersion = useSelector(VersionV2.active.versionSelector);
  const activateVersion = useDispatch(Version.activateVersion);
  const setError = useDispatch(Modal.setError);

  const loadProjectAndJoinChannel = React.useCallback(async () => {
    try {
      await activateVersion(versionID!, diagramID);
    } catch (e) {
      Sentry.error(e);
      setError(e);
    }
  }, [versionID, diagramID]);

  useProjectChannelReconnect();

  if (!versionID) {
    return <Redirect to={Path.DASHBOARD} />;
  }

  return (
    <LoadingGate label="Project" isLoaded={!!activeVersion && versionID === activeVersion.id} load={loadProjectAndJoinChannel}>
      <CommentingUpdates />
      <TranscriptUpdates />
      {children}
    </LoadingGate>
  );
};

export default withFeatureSwitcher(FeatureFlag.ATOMIC_ACTIONS, ProjectLoadingGateV2)(ProjectLoadingGate);
