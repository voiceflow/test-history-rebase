import React from 'react';
import { Redirect } from 'react-router-dom';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { withFeatureGate } from '@/hocs';
import { useProjectSubscription, useRouteVersionID, useSelector } from '@/hooks';

const ProjectSubscriptionGate: React.FC = ({ children }) => {
  const versionID = useRouteVersionID();
  const projectID = useSelector(Session.activeProjectIDSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const isSubscribed = useProjectSubscription({ projectID, workspaceID });

  if (!versionID) {
    return <Redirect to={Path.DASHBOARD} />;
  }

  return (
    <LoadingGate label="Project" isLoaded={isSubscribed}>
      {children}
    </LoadingGate>
  );
};

export default withFeatureGate(FeatureFlag.ATOMIC_ACTIONS)(ProjectSubscriptionGate);
