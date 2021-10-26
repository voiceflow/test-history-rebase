import { toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { FeatureFlag } from '@/config/features';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';

const GlobalSocketSubscriptionsLoadingGate: React.FC<ConnectedGlobalSocketSubscriptionsLoadingGateProps> = ({
  children,
  patchWorkspace,
  ejectFromWorkspace,
  setWebhookData,
  activeProjectID,
}) => {
  const isPrototypingMode = usePrototypingMode();
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  React.useEffect(() => {
    if (atomicActions.isEnabled) return undefined;

    return client.socket.global.watchForceRefresh(() => window.location.reload());
  }, []);
  React.useEffect(() => {
    if (atomicActions.isEnabled) return undefined;

    return client.socket.global.watchWorkspaceMembers(({ workspaceID, members }) => patchWorkspace(workspaceID, { members }));
  }, []);
  React.useEffect(() => {
    if (atomicActions.isEnabled) return undefined;

    return client.socket.global.watchForMembershipRevoked(({ workspaceId, workspaceName }) => ejectFromWorkspace(workspaceId, workspaceName));
  }, []);
  React.useEffect(
    () =>
      client.socket.global.watchForPrototypeWebhook(({ payload, projectID }) => {
        if (activeProjectID === projectID) {
          if (isPrototypingMode) {
            setWebhookData(payload);
          } else {
            toast.error('Please go to Test tool.');
          }
        } else {
          toast.error('Project ID does not match.');
        }
      }),
    []
  );

  return <>{children}</>;
};

const mapStateToProps = {
  activeProjectID: Session.activeProjectIDSelector,
};

const mapDispatchToProps = {
  patchWorkspace: Workspace.crud.patch,
  ejectFromWorkspace: Workspace.ejectFromActiveWorkspace,
  setWebhookData: Prototype.updatePrototypeWebhookData,
};

type ConnectedGlobalSocketSubscriptionsLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSocketSubscriptionsLoadingGate);
