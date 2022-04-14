import { toast } from '@voiceflow/ui';
import React from 'react';
import { useLocation } from 'react-router-dom';

import LoadingGate from '@/components/LoadingGate';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import * as Router from '@/ducks/router';
import * as Tracking from '@/ducks/tracking';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';
import * as Query from '@/utils/query';

const CheckInvitationGate: React.FC<CheckInvitationGateProps> = ({ acceptInvite, trackInvitationAccepted, redirectToDashboard, children }) => {
  const location = useLocation();
  const [inviteChecked, setInviteChecked] = React.useState(false);

  const checkForInvite = React.useCallback(async () => {
    if (!location.search) return;

    const query = Query.parse(location.search);

    if (!query.invite) return;

    const newWorkspaceID = await acceptInvite(query.invite, redirectToDashboard);
    const inviteSource = query.email ? 'email' : 'link';

    if (!newWorkspaceID) return;

    toast.success('Successfully joined workspace!');

    trackInvitationAccepted(newWorkspaceID, inviteSource).catch(() => {});

    redirectToDashboard();
  }, [location]);

  const load = React.useCallback(async () => {
    await checkForInvite();
    setInviteChecked(true);
  }, [checkForInvite]);

  return (
    <LoadingGate internalName={CheckInvitationGate.name} isLoaded={inviteChecked} load={load}>
      {children}
    </LoadingGate>
  );
};

const mapStateToProps = {
  email: Account.userEmailSelector,
};

const mapDispatchToProps = {
  acceptInvite: Workspace.acceptInvite,
  setModal: Modal.setModal,
  trackInvitationAccepted: Tracking.trackInvitationAccepted,
  redirectToDashboard: Router.redirectToDashboard,
};

const mergeProps = (...[{ email }, { trackInvitationAccepted }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  trackInvitationAccepted: (workspaceID: string, source: string) => trackInvitationAccepted(workspaceID, email!, source),
});

type CheckInvitationGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CheckInvitationGate);
