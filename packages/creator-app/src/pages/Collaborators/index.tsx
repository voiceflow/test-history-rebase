import React from 'react';

import * as Workspace from '@/ducks/workspace';
import { useActiveWorkspace, useDispatch } from '@/hooks';

import MemberSection from './components/MembersSection';
import SendInvite from './components/SendInvite';

interface CollaboratorsProps {
  inline?: boolean;
}

const Collaborators: React.FC<CollaboratorsProps> = ({ inline }) => {
  const workspace = useActiveWorkspace();
  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);

  const members = workspace?.members ?? [];

  return (
    <>
      <SendInvite inline={inline} sendInvite={sendInvite} />
      <MemberSection inline={inline} members={members} resendInvite={sendInvite} />
    </>
  );
};

export default Collaborators;
