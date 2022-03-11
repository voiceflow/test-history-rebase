import React from 'react';
import { Redirect } from 'react-router-dom';

import LoadingGate from '@/components/LoadingGate';
import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useRouteVersionID } from '@/hooks';

import CommentingUpdates from './CommentingUpdates';
import TranscriptUpdates from './TranscriptsUpdates';
import VersionSubscriptionGate from './VersionSubscriptionGate';

const ProjectLoadingGate: React.FC = ({ children }) => {
  const versionID = useRouteVersionID();
  const [context, setContext] = React.useState<{ workspaceID: string; projectID: string } | null>(null);
  const getVersionContext = useDispatch(VersionV2.getVersionContext);
  const goToDashboard = useDispatch(Router.goToDashboard);
  const isLoaded = !!context;

  const loadProjectContext = React.useCallback(async () => {
    try {
      const context = await getVersionContext(versionID!);

      setContext(context);
    } catch {
      goToDashboard();
    }
  }, [versionID]);

  if (!versionID) {
    return <Redirect to={Path.DASHBOARD} />;
  }

  return (
    <LoadingGate label="Project" isLoaded={isLoaded} load={loadProjectContext}>
      <CommentingUpdates />
      <TranscriptUpdates />
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain */}
      <VersionSubscriptionGate workspaceID={context?.workspaceID!} projectID={context?.projectID!} versionID={versionID}>
        {children}
      </VersionSubscriptionGate>
    </LoadingGate>
  );
};

export default ProjectLoadingGate;
