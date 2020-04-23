import React from 'react';

import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import * as Workspace from '@/ducks/workspace';
import { connect, styled } from '@/hocs';

import MemberSection from './components/MembersSection';
import SendInvite from './components/SendInvite';

const Container = styled.div`
  padding: 0px 0px 16px 32px;
  padding-top: 0;
`;

function Collaborators({ workspace, user, updateMembers, setConfirm, sendInvite }) {
  const removeMember = (index) => {
    const newMembers = workspace.members.filter((_, i) => i !== index);

    setConfirm({
      text: 'Are you sure you want to remove?',
      confirm: () => updateMembers(newMembers),
    });
  };

  return (
    <Container>
      <SendInvite sendInvite={sendInvite} />
      <MemberSection members={workspace.members} user={user} workspace={workspace} removeMember={removeMember} resendInvite={sendInvite} />
    </Container>
  );
}

const mapStateToProps = {
  user: Account.userSelector,
  workspace: Workspace.activeWorkspaceSelector,
};

const mapDispatchToProps = {
  setConfirm: Modal.setConfirm,
  sendInvite: Workspace.sendInvite,
  updateMembers: Workspace.updateMembers,
};

export default connect(mapStateToProps, mapDispatchToProps)(Collaborators);
