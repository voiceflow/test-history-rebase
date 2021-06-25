import React from 'react';

import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import MemberSection from './components/MembersSection';
import SendInvite from './components/SendInvite';

interface CollaboratorsProps {
  inline?: boolean;
}

const Collaborators: React.FC<CollaboratorsProps & ConnectedCollaboratorsProps> = ({ inline, workspace, sendInvite }) => {
  const members = workspace?.members ?? [];

  return (
    <>
      <SendInvite inline={inline} sendInvite={sendInvite} />
      <MemberSection inline={inline} members={members} resendInvite={sendInvite} />
    </>
  );
};

const mapStateToProps = {
  workspace: Workspace.activeWorkspaceSelector,
};

const mapDispatchToProps = {
  sendInvite: Workspace.sendInviteToActiveWorkspace,
};

type ConnectedCollaboratorsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Collaborators) as React.FC<CollaboratorsProps>;
