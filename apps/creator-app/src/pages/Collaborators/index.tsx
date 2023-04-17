import React from 'react';

import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';

import MemberSection from './components/MembersSection';
import SendInvite from './components/SendInvite';

interface CollaboratorsProps {
  inline?: boolean;
}

const Collaborators: React.FC<CollaboratorsProps> = ({ inline }) => {
  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);
  const members = useSelector(WorkspaceV2.active.allNormalizedMembersSelector);

  return (
    <>
      <SendInvite inline={inline} sendInvite={sendInvite} />
      <MemberSection inline={inline} members={members} resendInvite={(email, role) => sendInvite({ email, role })} />
    </>
  );
};

export default Collaborators;
