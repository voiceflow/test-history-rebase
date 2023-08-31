import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';

import MemberSection from './components/MembersSection';
import SendInvite from './components/SendInvite';

const Collaborators: React.FC = () => {
  const members = useSelector(WorkspaceV2.active.allNormalizedMembersSelector);
  const sendInvite = useDispatch(WorkspaceV2.sendInviteToActiveWorkspace);

  return (
    <>
      <SendInvite sendInvite={sendInvite} />
      <MemberSection members={members} resendInvite={(email, role) => sendInvite({ email, role })} />
    </>
  );
};

export default Collaborators;
