import { toast, useLinkedState } from '@voiceflow/ui';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { LoadingGate } from '@/components/LoadingGate';
import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import * as Tracking from '@/ducks/tracking';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';
import * as Query from '@/utils/query';

import WorkspaceOrProjectLoader from './WorkspaceOrProjectLoader';

const CheckInvitationGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();

  const email = useSelector(Account.userEmailSelector);
  const getWorkspaceByID = useSelector(WorkspaceV2.getWorkspaceByIDSelector);

  const acceptInvite = useDispatch(WorkspaceV2.acceptInvite);
  const redirectToDashboard = useDispatch(Router.redirectToDashboard);
  const trackInvitationAccepted = useDispatch(Tracking.trackInvitationAccepted);

  const query = React.useMemo(() => {
    if (!location.search) return {};

    return Query.parse(location.search);
  }, [location.search]);

  const [inviteChecked, setInviteChecked] = useLinkedState(!query.invite);

  const checkForInvite = React.useCallback(async () => {
    if (!query.invite) return;

    const newWorkspaceID = await acceptInvite(query.invite, redirectToDashboard);

    if (!newWorkspaceID) return;

    toast.success('Successfully joined workspace!');

    trackInvitationAccepted({
      email: query.email ?? email ?? 'unknown',
      source: query.email ? 'email' : 'link',
      workspaceID: newWorkspaceID,
      organizationID: getWorkspaceByID({ id: newWorkspaceID })?.organizationID ?? null,
    });

    redirectToDashboard();
  }, [email, location]);

  const load = React.useCallback(async () => {
    await checkForInvite();

    setInviteChecked(true);
  }, [checkForInvite]);

  return (
    <LoadingGate
      load={load}
      isLoaded={inviteChecked}
      loader={<WorkspaceOrProjectLoader />}
      internalName={CheckInvitationGate.name}
    >
      {children}
    </LoadingGate>
  );
};

export default CheckInvitationGate;
