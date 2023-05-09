import React from 'react';

import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';

import MemberSection from './components/MembersSection';
import SendInvite from './components/SendInvite';

const Collaborators: React.FC = () => {
  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);
  const members = useSelector(WorkspaceV2.active.allNormalizedMembersSelector);

  return (
    <>
      <SendInvite sendInvite={sendInvite} />
      <MemberSection members={members} resendInvite={(email, role) => sendInvite({ email, role })} />
    </>
  );
};

export default Collaborators;
