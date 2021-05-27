import React from 'react';

import * as Modal from '@/ducks/modal';
import * as Workspace from '@/ducks/workspace';
import { connect, styled } from '@/hocs';
import { ConnectedProps } from '@/types';

import MemberSection from './components/MembersSection';
import SendInvite from './components/SendInvite';

const Container = styled.div`
  padding: 0 0 16px 32px;
  padding-top: 0;
`;

const Collaborators: React.FC<ConnectedCollaboratorsProps> = ({ workspace, updateMembers, setConfirm, sendInvite }) => {
  const members = workspace?.members ?? [];

  const removeMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);

    setConfirm({
      text: 'Are you sure you want to remove?',
      confirm: () => updateMembers(newMembers),
    });
  };

  return (
    <Container>
      <SendInvite sendInvite={sendInvite} />
      <MemberSection members={members} removeMember={removeMember} resendInvite={sendInvite} />
    </Container>
  );
};

const mapStateToProps = {
  workspace: Workspace.activeWorkspaceSelector,
};

const mapDispatchToProps = {
  setConfirm: Modal.setConfirm,
  sendInvite: Workspace.sendInviteToActiveWorkspace,
  updateMembers: Workspace.updateActiveWorkspaceMembers,
};

type ConnectedCollaboratorsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Collaborators);
