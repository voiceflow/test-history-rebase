import { useLinkedState } from '@voiceflow/ui';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { LoadingGate } from '@/components/LoadingGate';
import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';
import * as Query from '@/utils/query';

import WorkspaceOrProjectLoader from './WorkspaceOrProjectLoader';

const CheckInvitationGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const email = useSelector(Account.userEmailSelector);

  const acceptInvite = useDispatch(WorkspaceV2.acceptInvite);
  const redirectToDashboard = useDispatch(Router.redirectToDashboard);

  const query = React.useMemo(() => {
    if (!location.search) return {};

    return Query.parse(location.search);
  }, [location.search]);

  const [inviteChecked, setInviteChecked] = useLinkedState(!query.invite);

  const load = React.useCallback(async () => {
    if (query.invite) {
      const newWorkspaceID = await acceptInvite(
        query.invite,
        {
          email: query.email ?? email ?? 'unknown',
          source: query.email ? 'email' : 'link',
        },
        redirectToDashboard
      );

      if (newWorkspaceID) {
        redirectToDashboard();
      }
    }

    setInviteChecked(true);
  }, []);

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
