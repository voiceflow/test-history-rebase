import React from 'react';

import client from '@/client';
import { toast } from '@/components/Toast';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
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

  React.useEffect(() => client.socket.global.watchForceRefresh(() => window.location.reload(true)));
  React.useEffect(() => client.socket.global.watchWorkspaceMembers(({ workspaceID, members }) => patchWorkspace(workspaceID, { members })));
  React.useEffect(() =>
    client.socket.global.watchForMembershipRevoked(({ workspaceId, workspaceName }) => ejectFromWorkspace(workspaceId, workspaceName))
  );
  React.useEffect(() =>
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
    })
  );

  return <>{children}</>;
};

const mapStateToProps = {
  activeProjectID: Skill.activeProjectIDSelector,
};

const mapDispatchToProps = {
  patchWorkspace: Workspace.patchWorkspace,
  ejectFromWorkspace: Workspace.ejectFromWorkspace,
  setWebhookData: Prototype.updatePrototypeWebhookData,
};

type ConnectedGlobalSocketSubscriptionsLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSocketSubscriptionsLoadingGate);
